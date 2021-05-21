import { FormLabel, Input, ListSubheader } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { stringCompare } from '../../../utils/sort';
import CeligoSelect from '../../CeligoSelect';
import CeligoTruncate from '../../CeligoTruncate';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';

const AUTO_CLEAR_SEARCH = 500;

const NO_OF_OPTIONS = 6;
const ITEM_SIZE = 48;
const OPTIONS_VIEW_PORT_HEIGHT = 300;

const getLabel = (items, value) => {
  const item = items.find(item => item.value === value);

  if (typeof item?.label === 'string') {
    return item.label;
  }
  if (item?.optionSearch) {
    return item.optionSearch;
  }

  return '';
};
const optionSearch = search => ({label, optionSearch}) => search && (
  (typeof optionSearch === 'string' && optionSearch.toLowerCase().startsWith(search.toLowerCase())) ||
 (typeof label === 'string' && label.toLowerCase().startsWith(search.toLowerCase())));
const useAutoScrollOption = (items, open, setOpen, listRef, id, value, onFieldChange) => {
  const label = getLabel(items, value) || '';
  const [search, setSearch] = useState(label);
  const [scrollIndex, setScrollIndex] = useState(-1);

  useEffect(() => {
    setSearch(label);
    setScrollIndex(-1);
  }, [open, label]);

  useEffect(() => {
    // clear out search result after
    const timerId = setTimeout(() => setSearch(''), AUTO_CLEAR_SEARCH);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);
  const keydownListener = useCallback(e => {
    // enter key
    if (e.keyCode === 13) {
      // scrollIndex -1 means the user hasn't selected anything using the key board based scroll...
      // so we should just close the options dropdown
      if (scrollIndex !== -1) { onFieldChange(id, items[scrollIndex].value); }
      setOpen(false);

      return;
    }

    if (e.keyCode < 32 || e.keyCode > 90) {
      return;
    }
    // up arrow key
    if (e.keyCode === 38) {
      if (scrollIndex <= 0) { return; }
      setScrollIndex(index => index - 1);

      return;
    }
    // down arrow key
    if (e.keyCode === 40) {
      if (scrollIndex >= items.length) { return; }
      setScrollIndex(index => index + 1);

      return;
    }

    if (e.key) {
      setSearch(str => str + e.key);
    }
  }, [onFieldChange, id, items, scrollIndex, setOpen]);

  useEffect(() => {
    const matchingIndex = items.findIndex(optionSearch(search));

    if (matchingIndex > 0) {
      setScrollIndex(matchingIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', keydownListener, true);
    }

    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener, open]);

  useEffect(() => {
    if (scrollIndex > 0) {
      if (scrollIndex + NO_OF_OPTIONS / 2 < items.length) {
        listRef?.current?.scrollToItem(scrollIndex + (NO_OF_OPTIONS / 2));
      } else {
        listRef?.current?.scrollToItem(scrollIndex);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollIndex]);

  return scrollIndex;
};

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
  focusVisibleMenuItem: {
    backgroundColor: theme.palette.secondary.lightest,
    transition: 'all .8s ease',
  },
  dynaSelectMenuItem: {
    wordBreak: 'break-word',
  },
}));

const Row = ({ index, style, data }) => {
  const {classes, items, matchMenuIndex, finalTextValue, onFieldChange, setOpen, id} = data;
  const { label, value, subHeader, disabled = false } = items[index];

  if (subHeader) {
    return (
      <ListSubheader disableSticky key={subHeader} style={style}>
        {subHeader}
      </ListSubheader>
    );
  }

  return (
    <MenuItem
      key={value}
      value={value}
      data-value={value}
      disabled={disabled}
      className={clsx(classes.dynaSelectMenuItem, {
        [classes.focusVisibleMenuItem]: matchMenuIndex === index,
      })}
      style={style}
      selected={value === finalTextValue}
      onClick={() => {
        if (value !== undefined) {
          onFieldChange(id, value);
        }

        setOpen(false);
      }}>
      <CeligoTruncate placement="left" lines={2}>
        {label}
      </CeligoTruncate>
    </MenuItem>
  );
};

export default function DynaSelect(props) {
  const {
    disabled,
    id,
    value,
    isValid = true,
    removeHelperText = false,
    name,
    options = [],
    defaultValue = '',
    placeholder,
    required,
    className,
    rootClassName,
    label,
    skipDefault = false,
    onFieldChange,
    skipSort,
    dataTest,
  } = props;

  const listRef = React.createRef();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const isSubHeader =
    options &&
    options.length &&
    options.some(
      option =>
        option &&
        option.items &&
        option.items.length &&
        option.items.some(item => item.subHeader)
    );
  const items = useMemo(() => {
    let items =
      options &&
      options.reduce(
        (itemsSoFar, option) =>
          itemsSoFar.concat(
            option?.items?.map(item => {
              let label;
              let value;

              if (typeof item === 'string') {
                label = item;
                value = item;
              } else {
                ({ value } = item);
                label = item.label || item.value;
              }

              return typeof item === 'string'
                ? { label, value }
                : { ...item, label, value };
            })
          ),
        []
      );

    if (!isSubHeader && !skipSort) {
      items = items.sort(stringCompare('label'));
    }

    const defaultItem = {
      label: placeholder || 'Please select',
      value: '',
    };

    if (!skipDefault) {
      items = [defaultItem, ...items];
    }

    return items;
  }, [options, isSubHeader, skipSort, placeholder, skipDefault]);

  const matchMenuIndex = useAutoScrollOption(items, open, setOpen, listRef, id, value, onFieldChange);
  let finalTextValue;

  if (value === undefined || value === null) {
    finalTextValue = defaultValue;
  } else {
    finalTextValue = value;
  }

  const renderValue = useCallback(selected => getLabel(items, selected), [items]);

  const openSelect = useCallback(() => {
    setOpen(true);
  }, []);
  const closeSelect = useCallback(
    () => {
      setOpen(false);
    }, []
  );
  const rowProps = useMemo(() => ({ classes, items, matchMenuIndex, finalTextValue, onFieldChange, setOpen, id }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, finalTextValue, id, items, matchMenuIndex, onFieldChange]);

  // if there are fewer options the view port height then let height scale per number of options

  const maxHeightOfSelect = items.length > NO_OF_OPTIONS
    ? OPTIONS_VIEW_PORT_HEIGHT
    : ITEM_SIZE * items.length;

  return (
    <div className={clsx(classes.dynaSelectWrapper, rootClassName)}>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        required={required}
        className={classes.dynaSelectWrapper}>
        <CeligoSelect
          data-test={dataTest || id}
          value={finalTextValue}
          disableUnderline
          displayEmpty
          maxHeightOfSelect={maxHeightOfSelect}
          renderValue={renderValue}
          open={open}
          onOpen={openSelect}
          onClose={closeSelect}
          disabled={disabled}
          // TODO: memoize this
          input={<Input name={name} id={id} />}>
          <FixedSizeList
            className={className}
            ref={listRef}
            itemSize={ITEM_SIZE}
            height={
              maxHeightOfSelect
            }
            itemCount={items.length}
            itemData={rowProps}
            >
            {Row}
          </FixedSizeList>
        </CeligoSelect>
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}

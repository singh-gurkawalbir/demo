import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { ListSubheader, FormLabel } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { FixedSizeList } from 'react-window';
import useTraceUpdate from 'use-trace-update';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';
import CeligoSelect from '../../CeligoSelect';
import { stringCompare } from '../../../utils/sort';

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
const optionSearch = (search) => ({label, optionSearch}) => search && (
  (typeof optionSearch === 'string' && optionSearch.toLowerCase().startsWith(search.toLowerCase())) ||
 (typeof label === 'string' && label.toLowerCase().startsWith(search.toLowerCase())));
const useAutoScrollOption = (items, open, listRef, value) => {
  const label = getLabel(items, value) || '';
  const [search, setSearch] = useState(label);
  const [scrolIndex, setScrolIndex] = useState(-1);

  useEffect(() => {
    setSearch(label);
    setScrolIndex(-1);
  }, [open, label]);

  useEffect(() => {
    // clear out search result after
    const timerId = setTimeout(() => setSearch(''), AUTO_CLEAR_SEARCH);
    return () => {
      clearTimeout(timerId);
    };
  }, [search]);
  const keydownListener = useCallback((e) => {
    if (e.keyCode < 32 || e.keyCode > 90) {
      return;
    }
    if (e.keyCode === 38) {
      if (scrolIndex <= 0) { return; }
      setScrolIndex(index => index - 1);
      return;
    }
    if (e.keyCode === 40) {
      if (scrolIndex >= items.length) { return; }
      setScrolIndex(index => index + 1);
      return;
    }
    if (e.key) {
      setSearch(str => str + e.key);
    }
  }, [items.length, scrolIndex]);

  useEffect(() => {
    const matchingIndex = items.findIndex(optionSearch(search));

    if (matchingIndex > 0) {
      setScrolIndex(matchingIndex);
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
    if (scrolIndex > 0) {
      if (scrolIndex + NO_OF_OPTIONS / 2 < items.length) {
        listRef?.current?.scrollToItem(scrolIndex + (NO_OF_OPTIONS / 2));
      } else {
        listRef?.current?.scrollToItem(scrolIndex);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrolIndex]);
  return scrolIndex;
};

const useStyles = makeStyles((theme) => ({
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
  }
}));


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
    label,
    onFieldChange,
    skipSort
  } = props;

  const listRef = React.createRef();
  useTraceUpdate(props);
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
            option.items.map(item => {
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

    items = [defaultItem, ...items];

    return items;
  }, [isSubHeader, skipSort, options, placeholder]);

  const matchMenuIndex = useAutoScrollOption(items, open, listRef, value);
  let finalTextValue;

  if (value === undefined || value === null) {
    finalTextValue = defaultValue;
  } else {
    finalTextValue = value;
  }

  const Row = ({ index, style }) => {
    const { label, value, subHeader, disabled = false } = items[index];
    const classes = useStyles();
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
        className={clsx({
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
        {label}
      </MenuItem>
    );
  };


  return (
    <div className={classes.dynaSelectWrapper}>
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
          data-test={id}
          value={finalTextValue}
          disableUnderline
          displayEmpty
          renderValue={selected => getLabel(items, selected)}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          disabled={disabled}
          input={<Input name={name} id={id} />}>
          <FixedSizeList
            className={className}
            ref={listRef}
            itemSize={ITEM_SIZE}
            // if there are fewer options the view port height then let height scale per number of options
            height={
              items.length > NO_OF_OPTIONS
                ? OPTIONS_VIEW_PORT_HEIGHT
                : ITEM_SIZE * items.length
            }
            itemCount={items.length}>
            {Row}
          </FixedSizeList>
        </CeligoSelect>
      </FormControl>

      {!removeHelperText && <ErroredMessageComponent {...props} />}
    </div>
  );
}

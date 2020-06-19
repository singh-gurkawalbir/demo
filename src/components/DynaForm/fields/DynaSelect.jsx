import React, { useMemo, useState, useCallback, useEffect} from 'react';
import { ListSubheader, FormLabel } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { FixedSizeList } from 'react-window';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';
import CeligoSelect from '../../CeligoSelect';
import { stringCompare } from '../../../utils/sort';

const AUTO_CLEAR_SEARCH = 500;

const NO_OF_OPTIONS = 6;
const ITEM_SIZE = 48;
const OPTIONS_VIEW_PORT_HEIGHT = 300;


const optionSearch = (search) => ({label, optionSearch}) => search && (
  (typeof optionSearch === 'string' && optionSearch.toLowerCase().startsWith(search)) ||
 (typeof label === 'string' && label.toLowerCase().startsWith(search)));
const useAutoScrollOption = (items, open, listRef) => {
  const [search, setSearch] = useState('');
  const [scrolIndex, setScrolIndex] = useState(-1);

  useEffect(() => {
    setSearch('');
    setScrolIndex(-1);
  }, [open]);

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
      setSearch(str => {
        const tmp = str + e.key;

        // console.log('see ', tmp);
        return tmp;
      });
    }
  }, [items.length, scrolIndex]);

  useEffect(() => {
    const matchingIndex = items.findIndex(optionSearch(search));

    if (matchingIndex > 0) {
      setScrolIndex(matchingIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  // console.log('matchingIndex ', matchingIndex);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', keydownListener, true);
    }
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener, open]);

  useEffect(() => {
    if (scrolIndex > 0) {
      listRef && listRef.current && listRef.current.scrollToItem(scrolIndex);
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

  const matchMenuIndex = useAutoScrollOption(items, open, listRef);
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
          renderValue={selected => {
            const item = items.find(item => item.value === selected);

            return item && item.label;
          }}
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

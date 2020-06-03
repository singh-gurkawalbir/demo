import { useMemo, useState } from 'react';
import { ListSubheader, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { FixedSizeList } from 'react-window';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';
import CeligoSelect from '../../CeligoSelect';
import { stringCompare } from '../../../utils/sort';

const useStyles = makeStyles({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
});
const NO_OF_OPTIONS = 6;
const ITEM_SIZE = 48;
const OPTIONS_VIEW_PORT_HEIGHT = 300;

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
    label,
    onFieldChange,
  } = props;
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

    if (!isSubHeader) {
      items = items.sort(stringCompare('label'));
    }

    const defaultItem = {
      label: placeholder || 'Please select',
      value: '',
    };

    items = [defaultItem, ...items];

    return items;
  }, [isSubHeader, options, placeholder]);
  let finalTextValue;

  if (value === undefined || value === null) {
    finalTextValue = defaultValue;
  } else {
    finalTextValue = value;
  }

  const Row = ({ index, style }) => {
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
        disabled={disabled}
        style={style}
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

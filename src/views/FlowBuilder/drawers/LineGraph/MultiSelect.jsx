import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { FormLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import CeligoSelect from '../../../../components/CeligoSelect';

const useStyles = makeStyles(theme => ({
  wrapper: {
    minHeight: 38,
    height: 'auto',
    '& >.MuiSelect-selectMenu': {
      height: 'auto',
    },
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: [[12, 0]],
  },
  chip: {
    margin: 4,
  },
  menuItems: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    '&:before': {
      display: 'none',
    },
  },
}));

// TODO: @Sravan Merge this with existing DynaMulltiSelect

export default function MultiSelect(props) {
  const {
    disabled,
    id,
    name,
    options = [],
    value = [],
    onFieldChange,
    placeholder,
    valueDelimiter,
    displayEmpty,
    isValid,
    label,
    required,
  } = props;
  const classes = useStyles();
  let processedValue = value || [];

  if (valueDelimiter && typeof value === 'string') {
    processedValue = value ? value.split(valueDelimiter) : [];
  }

  if (processedValue && !Array.isArray(processedValue)) {
    processedValue = [processedValue];
  }

  const Value = ({ selected, items }) => {
    if (!selected || !selected.length) {
      return <span>{placeholder}</span>;
    } else if (selected.length === 1 && items) {
      const selectedItem = items.find(i => i.value === selected[0]).label;

      return <span>{selectedItem}</span>;
    }

    return <span>Selected({selected.length})</span>;
  };

  let items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <MenuItem key={item} value={item} className={classes.menuItems}>
                <Checkbox
                  checked={processedValue.indexOf(item) !== -1}
                  color="primary"
                />
                <ListItemText primary={item} />
              </MenuItem>
            );
          }

          return (
            <MenuItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
              className={classes.menuItems}>
              {!item.disabled && (
                <Checkbox
                  checked={processedValue.indexOf(item.value) !== -1}
                  color="primary"
                />
              )}
              <ListItemText primary={item.label || item.value} />
            </MenuItem>
          );
        })
      ),
    []
  );
  const defaultItem = (
    <MenuItem key="__placeholder" value="">
      {placeholder || 'Please select'}
    </MenuItem>
  );

  items = [defaultItem, ...items];

  return (
    <div className={classes.multislectWrapper}>
      <div className={classes.labelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        required={required}
        className={classes.multislectWrapper}>
        <CeligoSelect
          multiple
          data-test={id}
          disabled={disabled}
          value={processedValue}
          placeholder={placeholder}
          displayEmpty={displayEmpty}
          className={classes.wrapper}
          onChange={evt => {
            onFieldChange(id, evt.target.value);
          }}
          input={<Input name={name} id={id} />}
          renderValue={selected => (
            <Value items={options[0].items} selected={selected} />
          )}>
          {items}
        </CeligoSelect>
      </FormControl>
    </div>
  );
}

import React, { useEffect, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Input from '@mui/material/Input';
import { FormLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import FieldMessage from './FieldMessage';
import CeligoSelect from '../../CeligoSelect';
import FieldHelp from '../FieldHelp';
import IntegrationTag from '../../tags/IntegrationTag';

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
    padding: 0,
    alignItems: 'center',
  },
  menuItems: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    '&:before': {
      display: 'none',
    },
  },
  multiselectWrapper: {
    width: '100%',
  },
}));

const chipUseStyles = makeStyles(theme => ({
  chip: {
    margin: 4,
  },
  // TODO: @azhar update the styling
  tagWrapper: {
    color: theme.palette.secondary.light,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const ChipLabel = ({label, tag}) => {
  const classes = chipUseStyles();

  if (!tag) return label;

  return (
    <>
      {label}
      <IntegrationTag className={classes.tagWrapper} label={tag} />
    </>
  );
};
const SelectedValueChip = ({label, value, tag}) => {
  const classes = chipUseStyles();
  const newLabel = <ChipLabel label={label || value} tag={tag} />;

  return (
    <Chip
      key={value}
      label={newLabel}
      className={classes.chip}
    />
  );
};

export default function DynaMultiSelect(props) {
  const {
    disabled,
    id,
    name,
    isLoading,
    options = [],
    value = [],
    label,
    onFieldChange,
    placeholder,
    valueDelimiter,
    isValid,
    required,
    removeInvalidValues = false,
    selectAllIdentifier,
    isLoggable,
    SelectedOptionIml,
  } = props;
  const classes = useStyles();
  let processedValue = value || [];

  if (valueDelimiter && typeof value === 'string') {
    processedValue = value ? value.split(valueDelimiter) : [];
  }

  if (processedValue && !Array.isArray(processedValue)) {
    processedValue = [processedValue];
  }

  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (SelectedOptionIml) {
            return (
              <MenuItem
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                className={classes.menuItems}>
                <SelectedOptionIml
                  item={item}
                  processedValue={processedValue}
                />
              </MenuItem>
            );
          }
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
              {item.tag && <IntegrationTag className={classes.tagWrapper} label={item.tag} />}
            </MenuItem>
          );
        })
      ),
    []
  );

  /**
   * Get a list of option items to filter out invalid options from value, when removeInvalidValues prop is set
   */
  const optionItems = useMemo(() => options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return item;
          }

          return item.value;
        })
      ),
    []
  ), [options]);

  useEffect(() => {
    if (removeInvalidValues && !isLoading) {
      // If the value contains any item not present in the options array, remove it.
      if (Array.isArray(processedValue) &&
       processedValue.length &&
        processedValue.filter(val => optionItems.includes(val))?.length !== processedValue.length) {
        onFieldChange(id, processedValue.filter(val => optionItems.includes(val)));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onFieldChange, optionItems, processedValue, removeInvalidValues]);

  const onMultiSelectFieldChange = evt => {
    const selectedValues = evt.target.value;

    if (!selectAllIdentifier || !selectedValues.includes(selectAllIdentifier)) {
      return onFieldChange(id, selectedValues);
    }

    // When user selects selectAll option, deselect other options
    if (selectedValues[selectedValues.length - 1] === selectAllIdentifier) {
      return onFieldChange(id, [selectAllIdentifier]);
    }
    // When user selects other options, remove selectAll selection
    const valuesExceptSelectAllIdentifier = selectedValues.filter(val => val !== selectAllIdentifier);

    onFieldChange(id, valuesExceptSelectAllIdentifier);
  };

  return (
    <div className={classes.multiselectWrapper}>
      <div className={classes.labelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        variant="standard"
        key={id}
        disabled={disabled}
        required={required}
        className={classes.multiselectWrapper}>
        <CeligoSelect
          multiple
          isLoggable={isLoggable}
          data-test={id}
          disabled={disabled}
          value={processedValue}
          placeholder={placeholder}
          displayEmpty
          className={classes.wrapper}
          onChange={onMultiSelectFieldChange}
          input={<Input name={name} id={id} />}
          renderValue={selected =>
            !selected || !selected.length ? (
              <span>{placeholder || 'Please select'}</span>
            ) : (
              <div className={classes.chips}>
                {selected &&
                  typeof selected.map === 'function' &&
                  selected.map(value => {
                    const fieldProps = options?.[0]?.items?.find(option => option.value === value);

                    return (fieldProps
                      ? (
                        <SelectedValueChip
                          key={value}
                          {...fieldProps} />
                      ) : null
                    );
                  })}
              </div>
            )}>
          {items}
        </CeligoSelect>
      </FormControl>

      <FieldMessage {...props} />
    </div>
  );
}

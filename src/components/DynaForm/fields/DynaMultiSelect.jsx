import React, { useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { FormLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import FieldMessage from './FieldMessage';
import CeligoSelect from '../../CeligoSelect';
import FieldHelp from '../FieldHelp';
import Tag from '../../HomePageCard/Footer/Tag';

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
  },
  menuItems: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    '&:before': {
      display: 'none',
    },
  },
  multislectWrapper: {
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
      <Tag className={classes.tagWrapper} variant={tag} />
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
              {item.tag && <Tag className={classes.tagWrapper} variant={item.tag} />}
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
  }, [id, onFieldChange, optionItems, processedValue, removeInvalidValues]);

  useEffect(() => {
    // this is used to force 'multiselect' field act as a 'select' field temporarily.
    // if selectAllIdentifier prop is passed, and user has selected that option, then we unselect all others.
    if (selectAllIdentifier && value?.length > 1 && value?.includes(selectAllIdentifier)) {
      onFieldChange(id, [selectAllIdentifier], true);
    }
  }, [id, onFieldChange, selectAllIdentifier, value]);

  return (
    <div className={classes.multislectWrapper}>
      <div className={classes.labelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
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
          displayEmpty
          className={classes.wrapper}
          onChange={evt => {
            onFieldChange(id, evt.target.value);
          }}
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
                          key={fieldProps.label}
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

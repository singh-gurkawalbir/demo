import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import clsx from 'clsx';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles({
  rowFlexWrapper: {
    flexDirection: 'row',
  },
  flexItems: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
});

export default function DynaRadio(props) {
  const {
    id,
    name,
    options = [],
    defaultValue,
    required,
    value,
    disabled,
    // showOptionsHorizontally is used to control options to render horizontally
    showOptionsHorizontally,
    // set fullWidth to true for component to occupy fill width
    fullWidth,
    label,
    isValid,
    onFieldChange,
  } = props;
  const classes = useStyles();
  const items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            return (
              <FormControlLabel
                key={item}
                value={item}
                control={<Radio color="primary" />}
                label={item}
                className={clsx({
                  [classes.flexItems]: showOptionsHorizontally,
                })}
              />
            );
          }

          return (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio color="primary" />}
              label={item.label || item.value}
              className={clsx({
                [classes.flexItems]: showOptionsHorizontally,
              })}
            />
          );
        })
      ),
    []
  );

  return (
    <FormControl
      error={!isValid}
      component="fieldset"
      required={required}
      disabled={disabled}
      className={fullWidth ? classes.fullWidth : ''}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        data-test={id}
        aria-label={label}
        className={clsx({
          [classes.rowFlexWrapper]: showOptionsHorizontally,
        })}
        name={name}
        defaultValue={defaultValue}
        value={value}
        color="primary"
        onChange={evt => {
          onFieldChange(id, evt.target.value);
        }}>
        {items}
      </RadioGroup>
      <ErroredMessageComponent {...props} />
    </FormControl>
  );
}

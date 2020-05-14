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
import ErroredMessageComponent from '../ErroredMessageComponent';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  columnFlexWrapper: {
    flexDirection: 'column',
  },
  radioGroupWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  radioGroup: {
    '& label': {
      marginLeft: 0,
      marginRight: theme.spacing(3),
      fontSize: 14,
    },
  },
  radioGroupLabel: {
    marginBottom: 0,
    marginRight: 12,
    fontSize: 14,
    '&:last-child': {
      marginRight: theme.spacing(0.5),
    },
    '&:empty': {
      display: 'none',
    },
  },
}));

export default function DynaRadio(props) {
  const {
    id,
    name,
    options = [],
    defaultValue,
    required,
    value,
    disabled,
    // use showOptionsVertically to render vertically
    showOptionsVertically,
    label,
    isValid,
    helpText,
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
              />
            );
          }

          return (
            <FormControlLabel
              key={item.value}
              value={item.value}
              control={<Radio color="primary" />}
              label={item.label || item.value}
            />
          );
        })
      ),
    []
  );

  return (
    <div>
      <FormControl component="fieldset" disabled={disabled}>
        <div className={classes.radioGroupWrapper}>
          <FormLabel
            required={required}
            error={!isValid}
            className={classes.radioGroupLabel}>
            {label ? `${label}:` : ''}
          </FormLabel>
          <div className={classes.radioGroupWrapper}>
            <RadioGroup
              data-test={id}
              aria-label={label}
              className={clsx(classes.radioGroup, {
                [classes.columnFlexWrapper]: showOptionsVertically,
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
            {/* Todo (surya): needs to pass the helptext */}
            <FieldHelp {...props} helpText={helpText || label} />
          </div>
        </div>
      </FormControl>
      <ErroredMessageComponent {...props} />
    </div>
  );
}

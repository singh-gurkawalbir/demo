import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import ErroredMessageComponent from '../ErroredMessageComponent';
import FieldHelp from '../../FieldHelp';
import helpTextMap from '../../../Help/helpTextMap';

const useStyles = makeStyles(theme => ({
  columnFlexWrapper: {
    flexDirection: 'column',
  },
  radioGroupWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioGroupWrapperLabel: {
    display: 'flex',
    marginBottom: theme.spacing(0.5),
  },
  radioGroup: {
    flexDirection: 'column',
    '& label': {
      marginLeft: 0,
      marginRight: theme.spacing(3),
      fontSize: 14,
      marginBottom: theme.spacing(0.5),
    },
  },
  radioGroupLabel: {
    marginBottom: 0,
    marginRight: theme.spacing(0.5),
    fontSize: 14,
    '&:last-child': {
      marginRight: theme.spacing(0.5),
    },
    '&:empty': {
      display: 'none',
    },
    '&.Mui-focused': {
      color: 'inherit',
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
    className,
    // use showOptionsVertically to render vertically
    showOptionsVertically,
    label,
    isValid,
    helpKey,
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
        <div className={clsx(classes.radioGroupWrapper, className)}>

          <div className={classes.radioGroupWrapperLabel}>
            <FormLabel
              required={required}
              error={!isValid}
              className={classes.radioGroupLabel}>
              {label ? `${label}` : ''}
            </FormLabel>
            {/* Todo (surya): needs to pass the helptext */}
            <FieldHelp
              {...props}
              helpText={(helpKey && helpTextMap[helpKey]) || label}
            />
          </div>
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

        </div>
      </FormControl>
      <ErroredMessageComponent {...props} />
    </div>
  );
}

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
  rowFlexWrapper: {
    flexDirection: 'row',
    paddingLeft: 5,
  },
  flexItems: {
    // flex: 1,
    wordBreak: 'break-all',
    lineHeight: '20px',
  },
  columnFlexWrapper: {
    flexDirection: 'column',
  },
  radioGroupWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  innerRadioWrapper: {
    display: 'flex',
  },
  radioGroup: {
    marginTop: 6,
    '& label': {
      marginBottom: theme.spacing(1),
      marginLeft: 0,
    },
  },
  radioGroupLabel: {
    marginBottom: 0,
    marginRight: 12,
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
            {label}:
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
            <FieldHelp {...props} />
          </div>
        </div>
      </FormControl>
      <ErroredMessageComponent {...props} />
    </div>
  );
}

import clsx from 'clsx';
import React from 'react';
import { FormControl, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  dynaLabelWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  dynaCheckControlLabel: {
    margin: 0,
    marginRight: 4,
    fontSize: 14,
  },
  dynaCheckbox: props => {
    props.hideLabelSpacing ? 0 : 12;
  },
  infoText: {
    color: theme.palette.error.dark,
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    padding: theme.spacing(0, 1),
    alignItems: 'center',
    lineHeight: 1,
  },
}));
// can this be loggable in all circumstances? since it is a checkbox
export default function DynaCheckbox(props) {
  const classes = useStyles(props);
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = '',
    label,
    inverse,
    required,
    isValid,
    className,
    isLoggable,
    labelSubText,
  } = props;

  return (
    <FormControl
      variant="standard"
      error={!isValid}
      required={required}
      disabled={disabled}
      className={clsx(classes.dynaLabelWrapper, className)}>
      <FormControlLabel
        control={(
          <Checkbox
            key={id}
            name={name}
            {...isLoggableAttr(isLoggable)}
            className={classes.dynaCheckbox}
            // isInvalid={!isValid}
            data-test={id}
            value={String(!!value)}
            checked={inverse ? !value : !!value}
            onChange={evt =>
              onFieldChange(
                id,
                inverse ? !evt.target.checked : evt.target.checked
              )}
          />
        )}
        className={classes.dynaCheckControlLabel}
        label={label}

      />
      {labelSubText && (<Typography variant="caption" className={classes.infoText}>{labelSubText}</Typography>)}

      <FieldHelp {...props} />
      <FieldMessage {...props} />
    </FormControl>
  );
}

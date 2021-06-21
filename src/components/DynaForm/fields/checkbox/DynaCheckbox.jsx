import clsx from 'clsx';
import React from 'react';
import { FormControl, makeStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles({
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
});

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
    dataPublic,
  } = props;

  return (
    <FormControl
      error={!isValid}
      required={required}
      disabled={disabled}
      className={clsx(classes.dynaLabelWrapper, className)}>
      <FormControlLabel
        control={(
          <Checkbox
            key={id}
            name={name}
            className={classes.dynaCheckbox}
            // isInvalid={!isValid}
            data-test={id}
            value={typeof value === 'string' ? value : value.toString()}
            checked={inverse ? !value : !!value}
            onChange={evt =>
              onFieldChange(
                id,
                inverse ? !evt.target.checked : evt.target.checked
              )}
          />
        )}
        data-public={!!dataPublic}
        className={classes.dynaCheckControlLabel}
        label={label}

      />
      <FieldHelp {...props} />
      <FieldMessage {...props} />
    </FormControl>
  );
}

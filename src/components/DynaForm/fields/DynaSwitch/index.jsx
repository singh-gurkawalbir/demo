import React, { useCallback } from 'react';
import { FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CeligoSwitch from '../../../CeligoSwitch';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(3),
  },
  margin: {
    marginRight: theme.spacing(0.5),
  },
}));

export default function DynaSwitch(props) {
  const { id, onFieldChange, value, label, tooltip, ...rest } = props;

  const classes = useStyles();

  const onChange = useCallback(
    e => {
      onFieldChange(id, e.target.checked);
    },
    [id, onFieldChange],
  );

  return (
    <div className={classes.container}>
      <FormLabel htmlFor={id} className={classes.margin}>
        {label}
      </FormLabel>
      <CeligoSwitch {...rest} onChange={onChange} checked={value} tooltip={rest.disabled ? tooltip : ''} />
      <FieldHelp {...props} />
    </div>
  );
}

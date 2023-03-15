/* eslint-disable no-console */
import React, { useCallback } from 'react';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CeligoSwitch from '../../../CeligoSwitch';
import FieldHelp from '../../FieldHelp';
import ActionGroup from '../../../ActionGroup';

const useStyles = makeStyles(theme => ({
  dynaSwitchLabel: {
    marginRight: theme.spacing(1),
  },
  dynaSwitch: {
    marginRight: theme.spacing(0),
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
    <ActionGroup className={classes.container}>
      <FormLabel htmlFor={id} className={classes.dynaSwitchLabel}>
        {label}
      </FormLabel>
      <CeligoSwitch
        {...rest}
        onChange={onChange}
        checked={value}
        tooltip={rest.disabled ? tooltip : ''}
        className={classes.dynaSwitch} />
      <FieldHelp {...props} />
    </ActionGroup>
  );
}

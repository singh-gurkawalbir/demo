/* eslint-disable no-console */
import React, { useCallback } from 'react';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Switch } from '@celigo/fuse-ui';
import FieldHelp from '../../FieldHelp';
import ActionGroup from '../../../ActionGroup';

const useStyles = makeStyles(theme => ({
  dynaSwitchLabel: {
    marginRight: theme.spacing(1),
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
      <Switch
        disabled={rest.disabled}
        onChange={onChange}
        checked={value}
        tooltip={rest.disabled ? tooltip : ''}
        sx={{mr: '0px !important'}} />
      <FieldHelp {...props} />
    </ActionGroup>
  );
}

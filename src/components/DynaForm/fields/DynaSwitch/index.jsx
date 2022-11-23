/* eslint-disable no-console */
import React, { useCallback } from 'react';
import { FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CeligoSwitch from '../../../CeligoSwitch';
import FieldHelp from '../../FieldHelp';
import ActionGroup from '../../../ActionGroup';

const useStyles = makeStyles(theme => ({
  dynaSwitchLabel: {
    marginRight: theme.spacing(3),
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
      <CeligoSwitch {...rest} onChange={onChange} checked={value} tooltip={tooltip} />
      <FieldHelp {...props} />
    </ActionGroup>
  );
}

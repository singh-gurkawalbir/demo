import React, { useCallback } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CeligoSwitch from '../../CeligoSwitch';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    paddingRight: theme.spacing(1),
  },
}));
export default function DynaCeligoSwitch(props) {
  const { disabled, value, id, label, onFieldChange } = props;
  const classes = useStyles();
  const handleSwitch = useCallback(() => {
    onFieldChange(id, !value);
  }, [id, onFieldChange, value]);

  return (
    <div className={classes.flexContainer}>
      <Typography className={classes.label}> {label} </Typography>
      <CeligoSwitch
        data-test={id}
        disabled={disabled}
        checked={value}
        onChange={handleSwitch}
      />
    </div>
  );
}

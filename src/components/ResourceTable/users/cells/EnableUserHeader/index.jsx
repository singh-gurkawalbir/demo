import React from 'react';
import { makeStyles } from '@material-ui/core';
import Help from '../../../../Help';

const useStyles = makeStyles(theme => ({
  helpIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function EnableUserHeader() {
  const classes = useStyles();

  return (
    <span>Enable user
      <Help
        title="Enable user"
        helpKey="users.enable"
        caption="users.enable"
        className={classes.helpIcon}
        />
    </span>
  );
}

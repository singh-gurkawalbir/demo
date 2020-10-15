import React from 'react';
import { makeStyles } from '@material-ui/core';
import Help from '../../../../Help';

const useStyles = makeStyles(theme => ({
  helpIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function AccessLevelHeader() {
  const classes = useStyles();

  return (
    <span>Access level
      <Help
        title="Access level"
        helpKey="users.accesslevel"
        caption="users.accesslevel"
        className={classes.helpIcon}
        />
    </span>
  );
}

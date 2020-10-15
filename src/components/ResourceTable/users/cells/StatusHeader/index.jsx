
import React from 'react';
import { makeStyles } from '@material-ui/core';
import Help from '../../../../Help';
import RefreshableHeading from '../../../commonCells/RefreshableHeading';

const useStyles = makeStyles(theme => ({
  helpIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  flexContainer: {
    display: 'flex',
  },
}));

export default function StatusHeader() {
  const classes = useStyles();

  return (
    <div className={classes.flexContainer}>
      <RefreshableHeading label="Status" resourceType="ashares" />
      <Help
        title="Status"
        helpKey="users.status"
        caption="users.status"
        className={classes.helpIcon}
        />
    </div>
  );
}

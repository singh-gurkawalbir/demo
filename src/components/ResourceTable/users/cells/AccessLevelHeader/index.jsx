import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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
        className={classes.helpIcon}
        disablePortal={false}
        />
    </span>
  );
}

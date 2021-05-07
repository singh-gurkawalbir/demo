import React from 'react';
import { makeStyles } from '@material-ui/core';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  helpIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function HeaderWithHelpText({ title, helpKey }) {
  const classes = useStyles();

  return (
    <span>{title}
      <Help
        title={title}
        helpKey={helpKey}
        caption={helpKey}
        className={classes.helpIcon}
        />
    </span>
  );
}

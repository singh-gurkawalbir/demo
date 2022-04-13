import React from 'react';
import { makeStyles } from '@material-ui/core';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  helpIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  textWithHelpIconWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  title: {
    whiteSpace: 'nowrap',
  },
}));

export default function HeaderWithHelpText({ title, helpKey }) {
  const classes = useStyles();

  return (
    <span className={classes.textWithHelpIconWrapper}>
      <span className={classes.title}>{title}</span>
      <Help
        title={title}
        helpKey={helpKey}
        className={classes.helpIcon}
        />
    </span>
  );
}

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Help from '../../../../../components/Help';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(0.5),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function HeaderWithHelpText({ children, title, helpKey }) {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      {children}
      <Help title={title} helpKey={helpKey} className={classes.helpTextButton} />
    </div>
  );
}

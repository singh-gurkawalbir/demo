import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Help from '../../../../../components/Help';

const useStyles = makeStyles(theme => ({
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
      <Help
        title={title}
        helpKey={helpKey}
        sx={{ml: 0.5}} />
    </div>
  );
}

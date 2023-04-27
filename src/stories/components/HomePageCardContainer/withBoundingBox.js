import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper2,
    height: '100vh',
    padding: theme.spacing(2),
    margin: theme.spacing(-2),
  },
}));

export default function (Story, context) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Story {...context} />
    </div>

  );
}

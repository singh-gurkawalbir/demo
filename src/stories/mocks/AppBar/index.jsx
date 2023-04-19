import React from 'react';
import { Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  mockPageBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    background: theme.palette.background.default,
    width: '100%',
    height: theme.appBarHeight,
    paddingLeft: 24,
  },
  text: {
    alignSelf: 'center',
    color: theme.palette.secondary.lightest,
  },
}));

export default function MockAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.mockPageBar}>
      <Typography className={classes.text}>
        CELIGO APP BAR
      </Typography>
    </div>
  );
}

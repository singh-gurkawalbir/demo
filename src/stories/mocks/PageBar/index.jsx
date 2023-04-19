import React from 'react';
import { Typography } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  mockPageBar: {
    position: 'absolute',
    left: 0,
    top: theme.appBarHeight,
    display: 'flex',
    background: theme.palette.background.paper,
    width: '100%',
    height: theme.pageBarHeight - 1,
    paddingLeft: 24,
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  text: {
    alignSelf: 'center',
    color: theme.palette.secondary.lightest,
  },
}));

export default function MockPageBar() {
  const classes = useStyles();

  return (
    <div className={classes.mockPageBar}>
      <Typography className={classes.text}>
        CELIGO PAGE BAR
      </Typography>
    </div>
  );
}

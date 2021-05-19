import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  mockPageBar: {
    position: 'absolute',
    left: 0,
    top: theme.appBarHeight + 1,
    display: 'flex',
    background: theme.palette.background.paper,
    width: '100%',
    height: theme.pageBarHeight,
    paddingLeft: 24,
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  text: {
    alignSelf: 'center',
  },
}));

export default function MockPageBar() {
  const classes = useStyles();

  return (
    <div className={classes.mockPageBar}>
      <Typography className={classes.text}>
        &lt;PageBar&gt;
      </Typography>
    </div>
  );
}

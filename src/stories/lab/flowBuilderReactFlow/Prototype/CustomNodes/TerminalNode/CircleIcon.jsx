import React from 'react';
import { makeStyles } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  svg: {
    width: 34,
    height: 34,
    // backgroundColor: theme.palette.common.white,
    fill: 'none',
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.primary.light,
    animation: '$dash 50s linear',
  },
  '@keyframes dash': {
    to: {
      strokeDashoffset: 500,
    },
  },
}));

export default function DiamondIcon() {
  const classes = useStyles();

  return (
    <svg viewBox="0 0 34 34" className={classes.svg} >
      <circle cx="16" cy="16" r="15.5" />
    </svg>
  );
}

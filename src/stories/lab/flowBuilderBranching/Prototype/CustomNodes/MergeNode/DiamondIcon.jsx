import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  button: {
    width: 34,
    height: 34,
    // backgroundColor: theme.palette.common.white,
    fill: theme.palette.background.default,
    stroke: theme.palette.secondary.lightest,
  },
  drop: {
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

export default function DiamondIcon({isDroppable}) {
  const classes = useStyles();

  return (
    <svg viewBox="0 0 34 34" className={clsx(classes.button, {[classes.drop]: isDroppable})} >
      <path d="m0,17l17,-17l17,17l-17,17l-17,-17z" />
    </svg>
  );
}

import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  button: {
    width: 34,
    height: 34,
    fill: theme.palette.background.paper,
    stroke: theme.palette.secondary.lightest,
  },
  // dropBorder: {
  //   animation: '$dash 50s linear',
  // },
  droppable: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.primary.main,
    fill: theme.palette.primary.lightest,
    '&:hover': {
      strokeDasharray: 0,
      strokeWidth: 1,
      stroke: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  '@keyframes dash': {
    to: {
      strokeDashoffset: 500,
    },
  },
}));

export default function DiamondIcon({isDroppable, className, ...rest}) {
  const classes = useStyles();

  return (
    <svg
      {...rest}
      viewBox="0 0 34 34"
      className={clsx(
        classes.button,
        {[classes.droppable]: isDroppable},
        className)}>
      <path d="m0,17l17,-17l17,17l-17,17l-17,-17z" />
    </svg>
  );
}

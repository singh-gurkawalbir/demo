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
  dropBorder: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.primary.main,
    // animation: '$dash 50s linear',
  },
  dropCenter: {
    fill: theme.palette.primary.main,
    stroke: theme.palette.primary.main,
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
    <svg viewBox="0 0 34 34" className={clsx(classes.button)}>
      <path d="m0,17l17,-17l17,17l-17,17l-17,-17z" className={clsx({[classes.dropBorder]: isDroppable})} />

      {isDroppable && (
      <path d="m6,17l11,-11l11,11l-11,11l-11,-11z" className={classes.dropCenter} />
      )}
    </svg>
  );
}

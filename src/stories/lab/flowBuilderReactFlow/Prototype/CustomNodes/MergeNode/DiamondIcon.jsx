import clsx from 'clsx';
import React from 'react';
import { SvgIcon, makeStyles } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
  button: {
    width: 34,
    height: 34,
    // backgroundColor: theme.palette.common.white,
    fill: 'none',
    stroke: theme.palette.secondary.lightest,
  },
  drop: {
    strokeDasharray: 2,
    strokeWidth: 1,
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
    <SvgIcon className={clsx(classes.button, {[classes.drop]: isDroppable})} >
      <path d="M12 0.808594L23.1914 12L12 23.1914L0.808594 12L12 0.808594Z" />
    </SvgIcon>
  );
}

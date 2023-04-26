import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(6),
    display: 'flex',
    color: theme.palette.background.default,
    alignItems: 'center',
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
    '& img': {
      maxWidth: theme.spacing(10),
      maxHeight: theme.spacing(6),
    },
    '& span': {
      color: theme.palette.secondary.contrastText,
      width: theme.spacing(3),
      height: theme.spacing(3),
      margin: theme.spacing(0, 1),
    },
  },
  threeAppImages: {
    '& img': {
      maxWidth: theme.spacing(9),
      maxHeight: theme.spacing(6),
    },
  },
  fourAppImages: {
    '& img': {
      maxWidth: theme.spacing(6),
      maxHeight: theme.spacing(6),
    },
    '& > span': {
      margin: '0px',
    },
  },

}));

export default function ApplicationImages({ children, className, noOfApps }) {
  const classes = useStyles();

  return (
    <div
      className={
        clsx(
          className,
          classes.root,
          {[classes.threeAppImages]: noOfApps === 3},
          {[classes.fourAppImages]: noOfApps === 4},
        )
      }>
      {children}
    </div>
  );
}

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    height: 48,
    display: 'flex',
    color: theme.palette.background.default,
    alignItems: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    '& img': {
      maxWidth: '84px',
      maxHeight: '84px',
    },
    '& span': {
      color: theme.palette.secondary.contrastText,
      width: 24,
      height: 24,
      margin: theme.spacing(0, 1),
    },
  },
  threeAppImages: {
    '& img': {
      maxWidth: theme.spacing(8),
      maxHeight: theme.spacing(8),
    },
    '& > span': {
      margin: '0px',
    },
  },
  fourAppImages: {
    '& img': {
      maxWidth: '45px',
      maxHeight: '45px',
    },
    '& > span': {
      margin: '0px',
    },
  },

}));

function ApplicationImages(props) {
  const classes = useStyles();
  const { children, className, noOfApps } = props;

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

export default ApplicationImages;

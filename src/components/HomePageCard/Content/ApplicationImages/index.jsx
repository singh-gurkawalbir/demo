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
      maxWidth: '64px',
      maxHeight: '64px',
    },
  },
  fourAppImages: {
    '& img': {
      maxWidth: '50px',
      maxHeight: '50px',
    },
  },

}));

function ApplicationImages(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={clsx(classes.root, {[classes.threeAppImages]: false}, {[classes.fourAppImages]: false})}>{children}</div>;
}

export default ApplicationImages;

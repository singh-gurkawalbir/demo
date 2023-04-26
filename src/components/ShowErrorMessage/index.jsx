import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import ErrorIcon from '../icons/ErrorIcon';
import RawHtml from '../RawHtml';

const useStyles = makeStyles(theme => ({
  wrapper: {
    fontSize: 12,
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: `${theme.spacing(2)}px`,
    textAlign: 'left',
  },
  icon: {
    fill: theme.palette.error.main,
    fontSize: theme.spacing(2),
    marginRight: theme.spacing(0.5),
  },
}));

export default function ShowErrorMessage({error, className}) {
  const classes = useStyles();

  return (
    error && (
    <Typography
      data-private
      color="error"
      component="div"
      variant="h5"
      className={clsx(classes.wrapper, className)}>
      <ErrorIcon className={classes.icon} />
      <RawHtml html={error} />
    </Typography>
    )
  );
}

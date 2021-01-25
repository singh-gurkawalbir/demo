import React from 'react';
import moment from 'moment';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoTimeAgo from '../../../CeligoTimeAgo';

const useStyles = makeStyles(theme => ({
  primary: {
    color: theme.palette.text.primary,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

export default function ExpiredOn({date}) {
  const classes = useStyles();

  if (!date) return '';

  const diff = moment(date).diff(moment(), 'days');
  const isLicenseExpiring = diff >= 0 && diff < 15;

  return (
    <Typography className={clsx(classes.primary, { [classes.warning]: isLicenseExpiring }, { [classes.error]: diff < 0})} >
      {moment(date).format('MMM D, YYYY')} (<CeligoTimeAgo date={date} />)
    </Typography>
  );
}

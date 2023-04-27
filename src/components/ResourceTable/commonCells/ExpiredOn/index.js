import React from 'react';
import moment from 'moment';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';

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

  const dateFormat = useSelector(state => selectors.userProfilePreferencesProps(state)?.dateFormat);
  const diff = moment(date).diff(moment(), 'days');
  const isLicenseExpiring = diff >= 0 && diff < 15;
  const isLicenseExpired = diff < 0;

  if (!date) return '';

  return (
    <Typography className={clsx(classes.primary, { [classes.warning]: isLicenseExpiring }, { [classes.error]: isLicenseExpired})} >
      {moment(date).format(dateFormat || 'MMM D, YYYY')} (<TimeAgo date={date} />)
    </Typography>
  );
}

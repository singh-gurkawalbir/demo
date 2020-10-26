import React from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import CeligoTimeAgo from '../../../CeligoTimeAgo';

export default function ExpiredOn({date}) {
  if (!date) return '';

  const hasExpired = moment(date) - moment() < 0;

  return (
    <Typography color={hasExpired ? 'error' : 'textPrimary'} >
      {moment(date).format('MMM D, YYYY')} (<CeligoTimeAgo date={date} />)
    </Typography>
  );
}

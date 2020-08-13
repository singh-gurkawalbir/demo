import React from 'react';
import moment from 'moment';
import { Typography } from '@material-ui/core';
import CeligoTimeAgo from '../../../CeligoTimeAgo';

export default function ExpiredOn({date}) {
  if (!date) return '';

  return (
    <Typography color="error">
      {moment(date).format('MMM D, YYYY')} (<CeligoTimeAgo date={date} />)
    </Typography>
  );
}

import React from 'react';
import moment from 'moment';
import { TimeAgo } from '@celigo/fuse-ui';
import DynaSelect from './DynaSelect';

// this can be loggable
export default function DynaExpiryTime(props) {
  const {value} = props;
  let timeValue;

  if (moment(value, moment.ISO_8601, true).isValid()) {
    timeValue = value;
  // eslint-disable-next-line no-restricted-globals
  } else if (!isNaN(value)) {
    timeValue = moment().add((+value) / 1000, 'seconds').toISOString();
  }

  return (
    <>
      <DynaSelect {...props} />
      {timeValue && <>Expires in <TimeAgo date={timeValue} /></>}
    </>
  );
}

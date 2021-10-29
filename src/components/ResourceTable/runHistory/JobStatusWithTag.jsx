import { Typography } from '@material-ui/core';
import React from 'react';
import Tag from '../../tags/Tag';

export default function JobStatusWithTag({job}) {
  const jobStatus = job?.status;

  if (!jobStatus) {
    return null;
  }
  const statusMap = {
    completed: <Tag color="success" label="Completed" />,
    canceled: <Tag color="warning" label="Canceled" />,
    failed: <Tag color="error" label="Failed" />,
  };

  return statusMap[jobStatus] || <Typography>{jobStatus}</Typography>;
}

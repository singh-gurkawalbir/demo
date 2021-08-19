import { Typography } from '@material-ui/core';
import React from 'react';
import StatusTag from '../../StatusTag';

export default function JobStatusWithTag({job}) {
  const jobStatus = job?.status;

  if (!jobStatus) {
    return null;
  }
  const statusMap = {
    completed: <StatusTag variant="success" label="Completed" />,
    canceled: <StatusTag variant="warning" label="Canceled" />,
    failed: <StatusTag variant="error" label="Failed" />,
  };

  return statusMap[jobStatus] || <Typography>{jobStatus}</Typography>;
}

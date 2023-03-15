import { Typography } from '@mui/material';
import React from 'react';
import Tag from '../../tags/Tag';

export default function JobStatusWithTag({job}) {
  let jobStatus = job?.status;

  if (!jobStatus) {
    return null;
  }

  if (jobStatus === 'completed' && job.numOpenError) {
    jobStatus = 'completedWithErrors';
  }

  const statusMap = {
    completedWithErrors: <Tag color="error" label="Completed" />,
    completed: <Tag color="success" label="Completed" />,
    canceled: <Tag color="warning" label="Canceled" />,
    failed: <Tag color="error" label="Failed" />,
  };

  return statusMap[jobStatus] || <Typography>{jobStatus}</Typography>;
}

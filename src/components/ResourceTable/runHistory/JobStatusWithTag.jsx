import { Box, Typography } from '@material-ui/core';
import React from 'react';
import Tag from '../../tags/Tag';
import InfoIconButton from '../../InfoIconButton';

const InfoTag = ({color, label, info}) => (
  <Box display="flex">
    <Tag color={color} label={label} />
    <Box>
      <InfoIconButton info={info} size="xs" placement="right" plainInfo />
    </Box>
  </Box>
);

export default function JobStatusWithTag({job}) {
  let jobStatus = job?.status;
  const isParentJob = job?.type === 'flow';

  if (!jobStatus) {
    return null;
  }

  if (jobStatus === 'canceled' && isParentJob && job?.canceledBy) {
    return <InfoTag color="warning" label="Canceled" info={`Canceled by ${job.canceledBy}`} />;
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

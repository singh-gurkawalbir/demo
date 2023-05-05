import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import Tag from '../../tags/Tag';
import InfoIconButton from '../../InfoIconButton';

const InfoTag = ({color, label, info}) => (
  <Box display="flex">
    <Tag color={color} label={label} />
    <Box>
      <InfoIconButton info={info} size="xs" placement="right" basicInfo />
    </Box>
  </Box>
);

export default function JobStatusWithTag({job, integrationId}) {
  const { status, type, canceledBy } = job || {};
  const isParentJob = type === 'flow';
  const userName = useSelector(state => {
    if (canceledBy === 'system') return 'system';
    const user = selectors.availableUsersList(state, integrationId)?.find(user => user.sharedWithUser?._id === canceledBy);

    return user?.sharedWithUser?.name || user?.sharedWithUser?.email || canceledBy;
  });

  if (!status) {
    return null;
  }

  if (status === 'canceled' && isParentJob && job?.canceledBy) {
    return <InfoTag color="warning" label="Canceled" info={`Canceled by ${userName}`} />;
  }

  let jobStatus = status;

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

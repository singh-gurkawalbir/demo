import React from 'react';
import { Box, Spinner } from '@celigo/fuse-ui';
import DashboardTag from '../../tags/DashboardTag';
import { getJobStatusDetails } from './util';

export default function JobStatus({ job }) {
  const jobStatusDetails = getJobStatusDetails(job);

  if (jobStatusDetails.showStatusTag) {
    return (
      <DashboardTag
        color={jobStatusDetails.variant}
        label={jobStatusDetails.status}
        errorCount={jobStatusDetails.errorValue || 0}
      />
    );
  }

  if (jobStatusDetails.showSpinner) {
    return (
      <Box display="flex" alignItems="center" whiteSpace="nowrap">
        <Spinner sx={{mr: '10px'}} />
        {jobStatusDetails.status}
      </Box>
    );
  }

  return jobStatusDetails.status;
}

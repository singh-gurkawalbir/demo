import React from 'react';
import RunDashboardV2 from '../../../../../../components/JobDashboard/RunDashboardV2';

export default function RunDashboardV2Panel({ flow }) {
  return (
    <RunDashboardV2 flowId={flow._id} />
  );
}

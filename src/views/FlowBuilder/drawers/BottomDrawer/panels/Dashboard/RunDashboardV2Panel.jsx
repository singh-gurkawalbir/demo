import React from 'react';
import RunDashboardV2 from '../../../../../../components/JobDashboard/RunDashboardV2';

export default function RunDashboardV2Panel({ flow }) {
  return (
    <RunDashboardV2
      integrationId={flow._integrationId || 'none'}
      flowId={flow._id}
      />
  );
}

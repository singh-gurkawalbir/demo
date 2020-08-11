import React from 'react';
import FlowRunDashboard from '../../../../../components/JobDashboard/FlowRunDashboard';

export default function FlowRunDashboardPanel({ flow }) {
  return (
    <FlowRunDashboard
      integrationId={flow._integrationId || 'none'}
      flowId={flow._id}
      />
  );
}

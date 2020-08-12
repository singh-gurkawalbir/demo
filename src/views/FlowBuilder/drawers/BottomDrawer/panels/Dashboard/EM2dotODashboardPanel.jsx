import React from 'react';
import EM2dotODashboard from '../../../../../../components/JobDashboard/EM2dotODashboard';

export default function EM2dotODashboardPanel({ flow }) {
  return (
    <EM2dotODashboard
      integrationId={flow._integrationId || 'none'}
      flowId={flow._id}
      />
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import RunDashboardV2 from '../../../../../../components/JobDashboard/RunDashboardV2';

export default function RunDashboardV2Panel({ flowId }) {
  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)._integrationId || 'none');

  return (
    <RunDashboardV2
      integrationId={integrationId}
      flowId={flowId}
      />
  );
}

import React from 'react';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getFlowGroup } from '../../../../utils/flows';

export default function FlowGroupCrumb({ integrationId, sectionId }) {
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);

  const flowGroupName = flowGroupings.length ? getFlowGroup(flowGroupings, '', sectionId)?.name : sectionId;

  return (
    <LoadResources resources="integrations">
      {flowGroupName || 'Flow group'}
    </LoadResources>
  );
}

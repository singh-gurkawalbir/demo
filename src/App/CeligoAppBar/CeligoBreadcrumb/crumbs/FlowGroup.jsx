import React from 'react';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getFlowGroup } from '../../../../utils/flows';

export default function FlowGroupCrumb({ integrationId, childId, sectionId }) {
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, (childId || integrationId));
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);
  const sectionTitle = flowSections.find(s => s.titleId === sectionId)?.title || sectionId;

  const flowGroupName = flowGroupings.length ? getFlowGroup(flowGroupings, '', sectionId)?.name : sectionTitle;

  return (
    <LoadResources resources="integrations">
      {flowGroupName || 'Flow group'}
    </LoadResources>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getFlowGroup } from '../../../../utils/flows';

export default function FlowGroupCrumb({ integrationId, childId, sectionId }) {
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, (childId || integrationId));
  const flowSections = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId, childId);
  const sectionTitle = flowSections.find(s => s.titleId === sectionId)?.title || sectionId;

  const flowGroupName = flowGroupings.length ? getFlowGroup(flowGroupings, '', sectionId)?.name : sectionTitle;
  const isIntegrationAppV2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  return (
    <LoadResources integrationId={integrationId} resources={isIntegrationAppV2 ? 'integrations' : ''}>
      {flowGroupName || 'Flow group'}
    </LoadResources>
  );
}

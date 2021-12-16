import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getFlowGroup } from '../../../../utils/flows';

export default function FlowGroupCrumb({ integrationId, sectionId }) {
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);

  const flowGroupName = isIntegrationApp ? sectionId : getFlowGroup(flowGroupings, '', sectionId)?.name;

  return (
    <LoadResources resources="integrations">
      {(isIntegrationApp || flowGroupings?.length) ? flowGroupName : 'Flow group'}
    </LoadResources>
  );
}

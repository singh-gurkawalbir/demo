import React from 'react';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import { UNASSIGNED_SECTION_NAME } from '../../../../utils/constants';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export default function FlowGroupCrumb({ integrationId, sectionId }) {
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);

  let flowGroupName = flowGroupings?.find(flowGroup => flowGroup._id === sectionId)?.name;

  if (!flowGroupName && flowGroupings?.length > 0) {
    flowGroupName = UNASSIGNED_SECTION_NAME;
  }

  return (
    <LoadResources resources="integrations">
      {flowGroupings?.length ? flowGroupName : 'Flow Group'}
    </LoadResources>
  );
}

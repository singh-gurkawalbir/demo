import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export default function FlowGroupCrumb({ integrationId, sectionId }) {
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  let flowGroupName = integration?.flowGroupings?.find(flowGroup => flowGroup._id === sectionId)?.name;

  if (!flowGroupName && integration?.flowGroupings?.length > 0) {
    flowGroupName = 'Unassigned';
  }

  return (
    <LoadResources resources="integrations">
      {integration ? flowGroupName : 'Flow Group'}
    </LoadResources>
  );
}

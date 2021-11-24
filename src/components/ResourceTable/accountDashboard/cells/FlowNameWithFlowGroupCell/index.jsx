import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import NameCell from '../../../commonCells/Name';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import { getFlowGroup } from '../../../../../utils/resource';

const FlowGroupName = ({ integrationId, flowId }) => {
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);

  if (!flowGroupings?.length) return null;

  const flowGroupName = getFlowGroup(flowGroupings, '', flow?._flowGroupingId).name;

  return (
    <Typography variant="body2" color="textSecondary">{flowGroupName}</Typography>
  );
};
export default function FlowNameWithFlowGroupCell({ flowId, integrationId }) {
  const tableContext = useGetTableContext();

  return (
    <>
      <NameCell al={{resourceType: 'flow', _resourceId: flowId}} actionProps={tableContext} />
      <FlowGroupName integrationId={integrationId} flowId={flowId} />
    </>
  );
}

import React from 'react';
import { Typography } from '@material-ui/core';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import NameCell from '../../../commonCells/Name';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import { getFlowGroup } from '../../../../../utils/flows';

export default function FlowNameWithFlowGroupCell({ flowId, integrationId }) {
  const tableContext = useGetTableContext();
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  const flowSectionsForIA1 = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId);
  let sectionName;
  let sectionId;

  if (flow?._connectorId) {
    const section = flowSectionsForIA1.find(flowSection => flowSection.flows?.some(flow => flow._id === flowId));

    sectionName = section?.title;
    sectionId = section?.titleId;
  } else {
    const section = getFlowGroup(flowGroupings, '', flow?._flowGroupingId);

    sectionName = section?.name;
    sectionId = section?._id;
  }

  return (
    <>
      <NameCell al={{resourceType: 'flow', _resourceId: flowId, sectionId}} actionProps={tableContext} />
      {sectionName && <Typography variant="body2" color="textSecondary">{sectionName}</Typography>}
    </>
  );
}

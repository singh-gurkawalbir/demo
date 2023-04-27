import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import NameCell from '../../../commonCells/Name';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import { getFlowGroup } from '../../../../../utils/flows';

export default function FlowNameWithFlowGroupCell({ flowId, integrationId }) {
  const tableContext = useGetTableContext();
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));
  const isIntegrationAppV2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId);
  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, integrationId);
  const flowSectionsForIA1 = useSelectorMemo(selectors.mkIntegrationAppFlowSections, integrationId);
  let sectionName;
  let sectionId;
  const overrideContext = {};

  if (isIntegrationAppV1) {
    const section = flowSectionsForIA1.find(flowSection => flowSection.flows?.some(flow => flow._id === flowId));

    sectionName = section?.title;
    sectionId = section?.titleId;
  } else {
    if (isIntegrationAppV2 && integration._parentId) {
      overrideContext.childId = integrationId;
    }
    const section = getFlowGroup(flowGroupings, '', flow?._flowGroupingId);

    sectionName = section?.name;
    sectionId = section?._id;
  }

  return (
    <>
      <NameCell
        al={{resourceType: 'flow', _resourceId: flowId, sectionId}}
        actionProps={{...tableContext, ...overrideContext}}
      />
      {sectionName && <Typography variant="body2" color="textSecondary">{sectionName}</Typography>}
    </>
  );
}

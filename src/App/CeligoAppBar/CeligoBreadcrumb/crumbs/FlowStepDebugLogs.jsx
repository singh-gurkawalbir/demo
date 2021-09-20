import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import {getFlowStepLabel} from '../../../../utils/flowStepLogs';

export default function FlowStepDebugLogs({ resourceType, id }) {
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, id)
  );
  const label = getFlowStepLabel(resourceType, resource);

  return (
    <LoadResources resources={resourceType}>
      View {label} logs
    </LoadResources>
  );
}

import React from 'react';
import { selectors } from '../../../../reducers';
import {getFlowStepLabel} from '../../../../utils/flowStepLogs';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export default function FlowStepDebugLogs({ resourceType, id }) {
  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, id);

  const label = getFlowStepLabel(resourceType, resource);

  return (
    <>
      View {label} logs
    </>
  );
}

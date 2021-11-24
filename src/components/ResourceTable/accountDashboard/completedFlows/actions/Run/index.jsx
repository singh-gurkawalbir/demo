import React, {} from 'react';
import RunIcon from '../../../../../icons/RunIcon';
import RunFlowButton from '../../../../../RunFlowButton';

export default {
  key: 'account-dashboard-run-flow',
  useLabel: () => 'Run flow',
  icon: RunIcon,
  Component: ({rowData}) => (

    <RunFlowButton
      flowId={rowData?._flowId}
      runOnMount
          />
  ),
};

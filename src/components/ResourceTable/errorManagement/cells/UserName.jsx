import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import OverflowWrapper from './OverflowWrapper';

export default function UserName({ userId, flowId }) {
  const userName = useSelector(state =>
    selectors.getIntegrationUserNameById(state, userId, flowId)
  );

  if (userId === 'autopilot') {
    return 'Autopilot';
  }

  return <OverflowWrapper message={userName || userId} />;
}

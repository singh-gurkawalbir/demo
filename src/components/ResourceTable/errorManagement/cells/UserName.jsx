import React from 'react';
import { useSelector } from 'react-redux';
import { JOB_TYPES } from '../../../../constants';
import { selectors } from '../../../../reducers';
import TextOverflowCell from '../../../TextOverflowCell';

export default function UserName({ userId, flowId, jobType }) {
  const userName = useSelector(state =>
    selectors.getIntegrationUserNameById(state, userId, flowId)
  );

  if (userId === 'auto') {
    if (jobType === JOB_TYPES.RETRY) {
      return 'Auto-retried';
    }

    return 'Auto-resolved';
  }

  return <TextOverflowCell message={userName || userId} maxWidth={240} />;
}

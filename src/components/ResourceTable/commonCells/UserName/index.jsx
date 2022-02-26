import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import TextOverflowCell from '../../../TextOverflowCell';

export default function UserName({ userId, flowId }) {
  const userName = useSelector(state =>
    selectors.getIntegrationUserNameById(state, userId, flowId)
  );

  return <TextOverflowCell message={userName || userId} maxWidth={240} />;
}

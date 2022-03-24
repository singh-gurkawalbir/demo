import React from 'react';
import { useSelector } from 'react-redux';
import TextOverflowCell from '../../../TextOverflowCell';
import { selectors } from '../../../../reducers';

export default function IntegrationUserName({ userId, integrationId }) {
  const userName = useSelector(state => {
    const integrationUsers = selectors.availableUsersList(state, integrationId);
    const user = integrationUsers?.find(user => userId === user.sharedWithUser._id);

    if (!user) return userId;

    return user.sharedWithUser.name || user.sharedWithUser.email;
  });

  return <TextOverflowCell message={userName} maxWidth={240} />;
}

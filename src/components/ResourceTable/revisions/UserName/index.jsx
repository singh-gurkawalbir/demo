import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import TextOverflowCell from '../../../TextOverflowCell';

export default function UserName({ userId, integrationId }) {
  // TODO: can reuse common cell
  const userName = useSelector(state => {
    const users = selectors.availableUsersList(state, integrationId);

    const user = users.find(user => userId === user.sharedWithUser._id);

    if (!user) return userId;

    return user.sharedWithUser.name || user.sharedWithUser.email;
  });

  return <TextOverflowCell message={userName} maxWidth={240} />;
}

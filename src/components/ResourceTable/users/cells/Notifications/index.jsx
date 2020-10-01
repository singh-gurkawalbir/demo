import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';

export default function Notifications({ user }) {
  const hasNotifications = useSelector(state =>
    selectors.integrationSubscribedNotifications(state, user.sharedWithUser.email)
  );

  return <div> { hasNotifications ? 'Yes' : 'No'} </div>;
}

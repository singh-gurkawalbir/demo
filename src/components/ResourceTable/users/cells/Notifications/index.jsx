import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';

export default function Notifications({ user }) {
  const notifications = useSelector(state => selectors.getSubscribedNotifications(state, user.sharedWithUser.email));

  return <div> { notifications.length ? 'Yes' : 'No'} </div>;
}

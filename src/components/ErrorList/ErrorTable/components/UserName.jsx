import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';

export default function UserName({ userId }) {
  // TODO @Raghu: Add selector to get user name
  const userName = useSelector(state => {
    const profile = selectors.userProfile(state);

    // If it is logged in user , return its name
    if (profile._id === userId) return profile.name || profile.email;
    // else check for org user's list , and if matches return name else id
    const sharedUserList = selectors.usersList(state).map(user => user.sharedWithUser);
    const user = sharedUserList.find(user => user._id === userId);

    return user ? user.name || user.email : userId;
  });

  if (userId === 'autopilot') {
    return 'Autopilot';
  }

  return <div> {userName || userId}</div>;
}

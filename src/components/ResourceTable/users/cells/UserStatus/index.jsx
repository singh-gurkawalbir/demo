import React from 'react';
import { USER_ACCESS_LEVELS } from '../../../../../utils/constants';

export default function UserStatus({ user, integrationId }) {
  if (user.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
    return null;
  }

  return (
    <>
      {!integrationId && (
      <>
        {user.accepted && 'Accepted'}
        {user.dismissed && 'Dismissed'}
        {!user.accepted && !user.dismissed && 'Pending'}
      </>
      )}
      {integrationId && (
      <>
        {user.disabled && 'Disabled'}
        {!user.disabled && user.accepted && 'Accepted'}
        {!user.disabled && user.dismissed && 'Dismissed'}
        {!user.disabled && !user.accepted && !user.dismissed && 'Pending'}
      </>
      )}
    </>
  );
}

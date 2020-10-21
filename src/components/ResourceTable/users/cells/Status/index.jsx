import React from 'react';

export default function Status({ user, integrationId }) {
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

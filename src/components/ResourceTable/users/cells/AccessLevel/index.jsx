import React from 'react';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../../../utils/constants';

export default function AccessLevel({ user, integrationId }) {
  let userAccessLevel = user.accessLevel;

  if (
    user.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR &&
    user.integrationAccessLevel &&
    user.integrationAccessLevel.length > 0
  ) {
    userAccessLevel = USER_ACCESS_LEVELS.TILE;
  }

  return (
    <>
      {!integrationId &&
      {
        [USER_ACCESS_LEVELS.ACCOUNT_OWNER]: 'Owner',
        [USER_ACCESS_LEVELS.ACCOUNT_MANAGE]: 'Manage',
        [USER_ACCESS_LEVELS.ACCOUNT_MONITOR]: 'Monitor',
        [USER_ACCESS_LEVELS.ACCOUNT_ADMIN]: 'Administrator',
        [USER_ACCESS_LEVELS.TILE]: 'Tile',
      }[userAccessLevel]}
      {integrationId &&
      {
        [INTEGRATION_ACCESS_LEVELS.OWNER]: 'Owner',
        [USER_ACCESS_LEVELS.ACCOUNT_ADMIN]: 'Administrator',
        [INTEGRATION_ACCESS_LEVELS.MANAGE]: 'Manage',
        [INTEGRATION_ACCESS_LEVELS.MONITOR]: 'Monitor',
      }[user.accessLevel]}
    </>
  );
}

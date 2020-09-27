import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../drawer/Right';
import UserFormWrapper from '../../UserFormWrapper';

function ChangePermissions({ integrationId }) {
  const match = useRouteMatch();
  const { userId } = match.params;

  return <UserFormWrapper integrationId={integrationId} userId={userId} />;
}
export default function ChangePermissionsDrawer({ integrationId }) {
  return (
    <RightDrawer
      path="edit/:userId"
      title="Change user permissions"
      variant="temporary"
      hideBackButton>
      <ChangePermissions integrationId={integrationId} />
    </RightDrawer>
  );
}

import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../drawer/Right';
import UserFormWrapper from '../../UserFormWrapper';

function ManagePermissions({ integrationId }) {
  const match = useRouteMatch();
  const { userId } = match.params;

  return <UserFormWrapper integrationId={integrationId} userId={userId} />;
}
export default function ManagePermissionsDrawer({ integrationId }) {
  return (
    <RightDrawer
      path="edit/:userId"
      title="Manage user permissions"
      variant="temporary"
      width="medium"
      hideBackButton>
      <ManagePermissions integrationId={integrationId} />
    </RightDrawer>
  );
}

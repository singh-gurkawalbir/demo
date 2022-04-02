import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import IsLoggableContextProvider from '../../../IsLoggableContextProvider';
import UserFormWrapper from '../../UserFormWrapper';
import { drawerPaths } from '../../../../utils/rightDrawer';

function ManagePermissions({ integrationId }) {
  const match = useRouteMatch();
  const { userId } = match.params;

  return <UserFormWrapper integrationId={integrationId} userId={userId} />;
}
export default function ManagePermissionsDrawer({ integrationId }) {
  return (
    <RightDrawer path={drawerPaths.ACCOUNT.MANAGE_USER_PERMISSIONS} width="medium">
      <DrawerHeader title="Manage user permissions" />
      <IsLoggableContextProvider isLoggable>
        <ManagePermissions integrationId={integrationId} />
      </IsLoggableContextProvider>
    </RightDrawer>
  );
}

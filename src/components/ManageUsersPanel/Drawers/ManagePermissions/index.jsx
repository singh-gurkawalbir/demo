import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { INVITE_USER_DRAWER_FORM_KEY } from '../../../../utils/constants';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import { useFormOnCancel } from '../../../FormOnCancelContext';
import UserFormWrapper from '../../UserFormWrapper';

function ManagePermissions({ integrationId, dataPublic }) {
  const match = useRouteMatch();
  const { userId } = match.params;

  return <UserFormWrapper dataPublic={dataPublic} integrationId={integrationId} userId={userId} />;
}
export default function ManagePermissionsDrawer({ integrationId }) {
  const {disabled, setCancelTriggered} = useFormOnCancel(INVITE_USER_DRAWER_FORM_KEY);

  return (
    <RightDrawer
      path="edit/:userId"
      variant="temporary"
      width="medium">
      <DrawerHeader disableClose={disabled} handleClose={setCancelTriggered} title="Manage user permissions" />
      <ManagePermissions dataPublic integrationId={integrationId} />
    </RightDrawer>
  );
}

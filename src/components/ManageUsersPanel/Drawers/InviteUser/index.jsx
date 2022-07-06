import React from 'react';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import UserFormWrapper from '../../UserFormWrapper';
import { drawerPaths } from '../../../../utils/rightDrawer';

export default function InviteUserDrawer() {
  return (
    <RightDrawer path={drawerPaths.ACCOUNT.INVITE_USER} width="medium" height="tall">
      <DrawerHeader title="Invite user" />
      <UserFormWrapper />
    </RightDrawer>
  );
}

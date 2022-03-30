import React from 'react';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import UserFormWrapper from '../../UserFormWrapper';
import { DRAWER_URLS } from '../../../../utils/drawerURLs';

export default function InviteUserDrawer() {
  return (
    <RightDrawer path={DRAWER_URLS.INVITE_USER} width="medium">
      <DrawerHeader title="Invite user" />
      <UserFormWrapper />
    </RightDrawer>
  );
}

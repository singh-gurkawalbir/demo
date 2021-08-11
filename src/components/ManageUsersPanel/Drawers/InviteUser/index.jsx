import React from 'react';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import UserFormWrapper from '../../UserFormWrapper';

export default function InviteUserDrawer() {
  return (
    <RightDrawer
      path="invite"
      variant="temporary"
      width="medium">
      <DrawerHeader title="Invite user" />
      <UserFormWrapper />
    </RightDrawer>
  );
}

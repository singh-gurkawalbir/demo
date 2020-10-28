import React from 'react';
import RightDrawer from '../../../drawer/Right/V2';
import DrawerHeader from '../../../drawer/Right/V2/DrawerHeader';
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

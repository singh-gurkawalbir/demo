import React from 'react';
import RightDrawer from '../../../drawer/Right';
import UserFormWrapper from '../../UserFormWrapper';

export default function InviteUserDrawer() {
  return (
    <RightDrawer
      path="invite"
      title="Invite user"
      variant="temporary"
      width="medium"
      hideBackButton>
      <UserFormWrapper />
    </RightDrawer>
  );
}

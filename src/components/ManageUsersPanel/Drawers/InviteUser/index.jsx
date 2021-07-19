import React from 'react';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import { useFormOnCancel } from '../../../FormOnCancelContext';
import UserFormWrapper from '../../UserFormWrapper';

export const INVITE_USER_DRAWER_FORM_KEY = 'inviteUserDrawerFormKey';

export default function InviteUserDrawer() {
  const {disabled, setCancelTriggered} = useFormOnCancel(INVITE_USER_DRAWER_FORM_KEY);

  return (
    <RightDrawer
      path="invite"
      variant="temporary"
      width="medium">
      <DrawerHeader disableClose={disabled} handleClose={setCancelTriggered} title="Invite user" />
      <UserFormWrapper />
    </RightDrawer>
  );
}

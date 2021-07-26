import React from 'react';
import { INVITE_USER_DRAWER_FORM_KEY } from '../../../../utils/constants';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import { useFormOnCancel } from '../../../FormOnCancelContext';
import UserFormWrapper from '../../UserFormWrapper';

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

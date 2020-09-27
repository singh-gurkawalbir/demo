import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CeligoSwitch from '../../../../CeligoSwitch';
import { ACCOUNT_IDS } from '../../../../../utils/constants';
import useConfirmDialog from '../../../../ConfirmDialog';
import actions from '../../../../../actions';

export default function EnableUser({ user, integrationId}) {
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();

  const handleSwitch = useCallback(() => {
    confirmDialog({
      title: `Confirm ${user.disabled ? 'enable' : 'disable'}`,
      message: `Are you sure you want to ${
        user.disabled ? 'enable' : 'disable'
      } this user?`,
      buttons: [
        {
          label: user.disabled ? 'Enable' : 'Disable',
          onClick: () => {
            dispatch(actions.user.org.users.disable(user._id, user.disabled));
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [confirmDialog, user._id, user.disabled, dispatch]);

  return (
    <CeligoSwitch
      data-test="disableUser"
      disabled={!user.accepted || (integrationId && (user._id === ACCOUNT_IDS.OWN))}
      checked={!user.disabled}
      onChange={handleSwitch}
      />
  );
}

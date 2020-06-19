import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  TableCell,
  TableRow,
  Typography,
  IconButton,
} from '@material-ui/core';
import actions from '../../../actions';
import useConfirmDialog from '../../ConfirmDialog';
import DeleteIcon from '../../icons/TrashIcon';
import CeligoSwitch from '../../CeligoSwitch';

export default function SharedUserRow({ user }) {
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const handleDeleteUserClick = useCallback(() => {
    confirmDialog({
      title: 'Confirm remove',
      message: 'Are you sure you want to remove?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Remove',
          onClick: () => {
            dispatch(actions.resource.delete('sshares', user._id));
          },
        },
      ],
    });
  }, [confirmDialog, dispatch, user._id]);
  const handleToggleSharingClick = useCallback(() => {
    confirmDialog({
      title: 'Confirm',
      message: `Are you sure you want to ${
        user.disabled ? 'enable' : 'disable'
      } sharing?`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.stack.toggleUserStackSharing(user._id));
          },
        },
      ],
    });
  }, [confirmDialog, dispatch, user._id, user.disabled]);
  const handleReinviteClick = useCallback(() => {
    const userInfo = {
      ...user,
      dismissed: false,
      disabled: false,
      _sharedWithUserId: user.sharedWithUser && user.sharedWithUser._id,
    };

    dispatch(actions.stack.reInviteStackUser(userInfo, userInfo._id));
  }, [dispatch, user]);

  return (
    <TableRow>
      <TableCell>
        <Typography>{user.sharedWithUser.email}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{user.sharedWithUser.name}</Typography>
      </TableCell>
      <TableCell>
        {user.accepted && 'Accepted'}
        {user.dismissed && 'Dismissed'}
        {!user.accepted && !user.dismissed && 'Pending'}
      </TableCell>
      <TableCell>
        {user.accepted && (
          <CeligoSwitch
            data-test="disableUser"
            enabled={!user.disabled}
            onChange={handleToggleSharingClick}
          />
        )}
        {user.dismissed && (
          <Button onClick={handleReinviteClick}>Reinvite</Button>
        )}
      </TableCell>
      <TableCell>
        <IconButton
          data-test="deleteStackShareInvite"
          aria-label="delete"
          onClick={handleDeleteUserClick}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  TableCell,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import { Switch } from '@celigo/fuse-ui';
import actions from '../../../actions';
import useConfirmDialog from '../../ConfirmDialog';
import DeleteIcon from '../../icons/TrashIcon';
import { TextButton } from '../../Buttons';

export default function SharedUserRow({ user }) {
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const handleDeleteUserClick = useCallback(() => {
    confirmDialog({
      title: 'Confirm remove',
      message: 'Are you sure you want to remove?',
      buttons: [
        {
          label: 'Remove',
          onClick: () => {
            dispatch(actions.resource.delete('sshares', user._id));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch, user._id]);
  const handleToggleSharingClick = useCallback(() => {
    confirmDialog({
      title: `Confirm ${user.disabled ? 'enable' : 'disable'}`,
      message: `Are you sure you want to ${
        user.disabled ? 'enable' : 'disable'
      } sharing with this user?`,
      buttons: [
        {
          label: user.disabled ? 'Enable' : 'Disable',
          onClick: () => {
            dispatch(actions.stack.toggleUserStackSharing(user._id));
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
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
          <Switch
            data-test="disableUser"
            checked={!user.disabled}
            onChange={handleToggleSharingClick}
          />
        )}
        {user.dismissed && (
          <TextButton onClick={handleReinviteClick}>Reinvite</TextButton>
        )}
      </TableCell>
      <TableCell>
        <IconButton
          data-test="deleteStackShareInvite"
          aria-label="delete"
          onClick={handleDeleteUserClick}
          size="large">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

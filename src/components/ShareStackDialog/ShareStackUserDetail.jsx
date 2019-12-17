import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import actions from '../../actions';
import { confirmDialog } from '../../components/ConfirmDialog';

export default function ShareStackUserDetail(props) {
  const { user } = props;
  const dispatch = useDispatch();
  const handleDeleteUserClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to remove this sharing?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('sshares', user._id));
          },
        },
      ],
    });
  };

  const handleToggleSharingClick = () => {
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
  };

  const handleReinviteClick = () => {
    const userInfo = {
      ...user,
      dismissed: false,
      disabled: false,
      _sharedWithUserId: user.sharedWithUser && user.sharedWithUser._id,
    };

    dispatch(actions.stack.reInviteStackUser(userInfo, userInfo._id));
  };

  return (
    <TableRow>
      <TableCell>
        {user.sharedWithUser && (
          <Fragment>
            <Typography>{user.sharedWithUser.name}</Typography>
            <Typography>{user.sharedWithUser.email}</Typography>
          </Fragment>
        )}
      </TableCell>
      <TableCell>
        {user.accepted && 'Accepted'}
        {user.dismissed && 'Dismissed'}
        {!user.accepted && !user.dismissed && 'Pending'}
      </TableCell>
      <TableCell>
        {user.accepted && (
          <Switch
            checked={!user.disabled}
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

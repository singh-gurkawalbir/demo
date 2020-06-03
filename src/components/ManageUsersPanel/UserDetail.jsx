import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import EditIcon from '../icons/EditIcon';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  ACCOUNT_IDS,
} from '../../utils/constants';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import useConfirmDialog from '../ConfirmDialog';
import CommStatus from '../CommStatus';
import MoreHorizIcon from '../icons/EllipsisHorizontalIcon';
import CeligoSwitch from '../CeligoSwitch';

// TODO: Refactor this component
export default function UserDetail(props) {
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const dispatch = useDispatch();
  const disableUser = useCallback(
    (id, disabled) => {
      dispatch(actions.user.org.users.disable(id, disabled));
    },
    [dispatch]
  );
  const deleteUser = useCallback(
    id => {
      dispatch(actions.user.org.users.delete(id));
    },
    [dispatch]
  );
  const makeOwner = useCallback(
    email => {
      dispatch(actions.user.org.users.makeOwner(email));
    },
    [dispatch]
  );
  const handleActionClick = action => {
    setAnchorEl(null);
    const { user, editClickHandler } = props;

    switch (action) {
      case 'disable':
        confirmDialog({
          title: 'Confirm',
          message: `Are you sure you want to ${
            user.disabled ? 'enable' : 'disable'
          } this user?`,
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                disableUser(user._id, user.disabled);
              },
            },
          ],
        });
        break;
      case 'makeOwner':
        confirmDialog({
          title: 'Transfer Account Ownership',
          isHtml: true,
          message: `${
            user.sharedWithUser.name
              ? `<b>${user.sharedWithUser.name}</b> (${user.sharedWithUser.email})`
              : `<b>${user.sharedWithUser.email}</b>`
          } <br/> 
          All owner privileges will be transferred to this user, and your account will be converted to Manager. <br/>
          Please click Confirm to proceed with this change.
          `,
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                makeOwner(user.sharedWithUser.email);
              },
            },
          ],
        });
        break;
      case 'delete':
        confirmDialog({
          title: 'Confirm',
          message: 'Are you sure you want to delete this user?',
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                deleteUser(user._id);
              },
            },
          ],
        });
        break;
      case 'edit':
        editClickHandler(user._id);
        break;
      default:
    }
  };

  const getMessageForAction = useCallback((action, commStatus, user) => {
    let message;

    if (action === 'disable') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `User ${user.sharedWithUser.name ||
          user.sharedWithUser.email} ${
          user.disabled ? 'enabled' : 'disabled'
        } successfully`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `${user.disabled ? 'Enabling' : 'Disabling'} user ${user
          .sharedWithUser.name ||
          user.sharedWithUser.email} failed due to the error "${
          commStatus.message
        }"`;
      }
    } else if (action === 'delete') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `User ${user.sharedWithUser.name ||
          user.sharedWithUser.email} deleted successfully`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `Deleting user ${user.sharedWithUser.name ||
          user.sharedWithUser.email} is failed due to the error "${
          commStatus.message
        }"`;
      }
    } else if (action === 'makeOwner') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `An Account Ownership invitation has been sent to 
        ${user.sharedWithUser.name} (${user.sharedWithUser.email}).
        <br/>Once accepted, your account will be converted to a regular user account with Manager access.`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `Request to make user ${user.sharedWithUser.name ||
          user.sharedWithUser
            .email} as account owner is failed due to the error "${
          commStatus.message
        }"`;
      }
    }

    return message;
  }, []);
  const commStatusHandler = useCallback(
    objStatus => {
      const { user, statusHandler } = props;

      ['disable', 'makeOwner', 'delete'].forEach(a => {
        if (
          objStatus[a] &&
          [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus[a].status)
        ) {
          statusHandler({
            status: objStatus[a].status,
            message: getMessageForAction(a, objStatus[a], user),
          });
        }
      });
    },
    [getMessageForAction, props]
  );
  const { user, integrationId, isAccountOwner } = props;

  return (
    <>
      <CommStatus
        actionsToMonitor={{
          disable: { action: actionTypes.USER_DISABLE, resourceId: user._id },
          makeOwner: { action: actionTypes.USER_MAKE_OWNER },
          delete: { action: actionTypes.USER_DELETE, resourceId: user._id },
        }}
        autoClearOnComplete
        commStatusHandler={objStatus => {
          commStatusHandler(objStatus);
        }}
      />
      <TableRow key={user._id}>
        <TableCell>
          <div>{user.sharedWithUser.email}</div>
        </TableCell>
        <TableCell>
          <div>{user.sharedWithUser.name}</div>
        </TableCell>
        <TableCell>
          {!integrationId &&
            {
              [USER_ACCESS_LEVELS.ACCOUNT_MANAGE]: 'Manage',
              [USER_ACCESS_LEVELS.ACCOUNT_MONITOR]: 'Monitor',
              [USER_ACCESS_LEVELS.TILE]: 'Tile',
            }[user.accessLevel]}
          {integrationId &&
            {
              [INTEGRATION_ACCESS_LEVELS.OWNER]: 'Owner',
              [INTEGRATION_ACCESS_LEVELS.MANAGE]: 'Manage',
              [INTEGRATION_ACCESS_LEVELS.MONITOR]: 'Monitor',
            }[user.accessLevel]}
        </TableCell>
        <TableCell>
          {!integrationId && (
            <>
              {user.accepted && 'Accepted'}
              {user.dismissed && 'Dismissed'}
              {!user.accepted && !user.dismissed && 'Pending'}
            </>
          )}
          {integrationId && (
            <>
              {user.disabled && 'Disabled'}
              {!user.disabled && user.accepted && 'Accepted'}
              {!user.disabled && user.dismissed && 'Dismissed'}
              {!user.disabled && !user.accepted && !user.dismissed && 'Pending'}
            </>
          )}
        </TableCell>
        {isAccountOwner && (
          <>
            {integrationId && user._id !== ACCOUNT_IDS.OWN && (
              <TableCell>
                <IconButton
                  data-test="editUser"
                  onClick={() => {
                    handleActionClick('edit');
                  }}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            )}

            {!integrationId && (
              <>
                <TableCell>
                  <CeligoSwitch
                    data-test="disableUser"
                    enabled={!user.disabled}
                    onChange={() => {
                      handleActionClick('disable');
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <MenuItem
                      data-test="changeUserPermissions"
                      onClick={() => {
                        handleActionClick('edit');
                      }}>
                      Change permissions
                    </MenuItem>
                    <Divider />
                    {user.accepted && (
                      <MenuItem
                        data-test="makeAccountOwner"
                        onClick={() => {
                          handleActionClick('makeOwner');
                        }}>
                        Make account owner
                      </MenuItem>
                    )}
                    {user.accepted && <Divider />}
                    <MenuItem
                      data-test="deleteFromAccount"
                      onClick={() => {
                        handleActionClick('delete');
                      }}>
                      Delete from account
                    </MenuItem>
                  </Menu>
                  <IconButton onClick={handleClick}>
                    <MoreHorizIcon />
                  </IconButton>
                </TableCell>
              </>
            )}
          </>
        )}
      </TableRow>
    </>
  );
}

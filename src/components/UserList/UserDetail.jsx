import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
import { confirmDialog } from '../ConfirmDialog';
import CommStatus from '../CommStatus';

const mapDispatchToProps = dispatch => ({
  disableUser: (id, disabled) => {
    dispatch(actions.user.org.users.disable(id, disabled));
  },
  deleteUser: id => {
    dispatch(actions.user.org.users.delete(id));
  },
  makeOwner: email => {
    dispatch(actions.user.org.users.makeOwner(email));
  },
});

@hot(module)
class UserDetail extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleActionClick = action => {
    this.setState({ anchorEl: null });

    const {
      user,
      disableUser,
      deleteUser,
      makeOwner,
      editClickHandler,
    } = this.props;

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
          message: [
            `<b>${user.sharedWithUser.name}</b> (${user.sharedWithUser.email})`,
            'All owner privileges will be transferred to this user, and your account will be converted to Manager.',
            'Please click Confirm to proceed with this change.',
          ].join('<br/>'),
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

  getMessageForAction(action, commStatus, user) {
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
  }

  commStatusHandler(objStatus) {
    const { user, statusHandler } = this.props;

    ['disable', 'makeOwner', 'delete'].forEach(a => {
      if (
        objStatus[a] &&
        [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus[a].status)
      ) {
        statusHandler({
          status: objStatus[a].status,
          message: this.getMessageForAction(a, objStatus[a], user),
        });
      }
    });
  }
  render() {
    const { anchorEl } = this.state;
    const { user, integrationId, isAccountOwner } = this.props;

    return (
      <Fragment>
        <CommStatus
          actionsToMonitor={{
            disable: { action: actionTypes.USER_DISABLE, resourceId: user._id },
            makeOwner: { action: actionTypes.USER_MAKE_OWNER },
            delete: { action: actionTypes.USER_DELETE, resourceId: user._id },
          }}
          autoClearOnComplete
          commStatusHandler={objStatus => {
            this.commStatusHandler(objStatus);
          }}
        />
        <TableRow key={user._id}>
          <TableCell>
            <div>{user.sharedWithUser.name}</div>
            <div>{user.sharedWithUser.email}</div>
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
              <Fragment>
                {user.accepted && 'Accepted'}
                {user.dismissed && 'Dismissed'}
                {!user.accepted && !user.dismissed && 'Pending'}
              </Fragment>
            )}
            {integrationId && (
              <Fragment>
                {user.disabled && 'Disabled'}
                {!user.disabled && user.accepted && 'Accepted'}
                {!user.disabled && user.dismissed && 'Dismissed'}
                {!user.disabled &&
                  !user.accepted &&
                  !user.dismissed &&
                  'Pending'}
              </Fragment>
            )}
          </TableCell>
          {isAccountOwner && (
            <Fragment>
              <TableCell>
                {integrationId && user._id !== ACCOUNT_IDS.OWN && (
                  <IconButton
                    data-test="editUser"
                    onClick={() => {
                      this.handleActionClick('edit');
                    }}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>

              {!integrationId && (
                <Fragment>
                  <TableCell>
                    <Switch
                      data-test="disableUser"
                      checked={!user.disabled}
                      onClick={() => {
                        this.handleActionClick('disable');
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={this.handleClose}>
                      <MenuItem
                        data-test="changeUserPermissions"
                        onClick={() => {
                          this.handleActionClick('edit');
                        }}>
                        Change permissions
                      </MenuItem>
                      <Divider />
                      {user.accepted && (
                        <MenuItem
                          data-test="makeAccountOwner"
                          onClick={() => {
                            this.handleActionClick('makeOwner');
                          }}>
                          Make account owner
                        </MenuItem>
                      )}
                      {user.accepted && <Divider />}
                      <MenuItem
                        data-test="deleteFromAccount"
                        onClick={() => {
                          this.handleActionClick('delete');
                        }}>
                        Delete from account
                      </MenuItem>
                    </Menu>
                    <IconButton onClick={this.handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </Fragment>
              )}
            </Fragment>
          )}
        </TableRow>
      </Fragment>
    );
  }
}

export default connect(
  null, // mapStateToProps,
  mapDispatchToProps
)(UserDetail);

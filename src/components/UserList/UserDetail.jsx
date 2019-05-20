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
import EditIcon from 'mdi-react/EditIcon';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  ACCOUNT_IDS,
} from '../../utils/constants';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { COMM_STATES } from '../../reducers/comms';
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
      data,
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
            data.disabled ? 'enable' : 'disable'
          } this user?`,
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                disableUser(data._id, data.disabled);
              },
            },
          ],
        });
        break;
      case 'makeOwner':
        confirmDialog({
          title: 'Transfer Account Ownership',
          message: [
            `<b>${data.sharedWithUser.name}</b> (${data.sharedWithUser.email})`,
            'All owner privilages will be transfered to this user, and your account will be converted to Manager.',
            'Please click Confirm to proceed with this change.',
          ].join('<br/>'),
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                makeOwner(data.sharedWithUser.email);
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
                deleteUser(data._id);
              },
            },
          ],
        });
        break;
      case 'edit':
        editClickHandler(data._id);
        break;
      default:
    }
  };

  getMessageForAction(action, commStatus, data) {
    let message;

    if (action === 'disable') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `User ${data.sharedWithUser.name ||
          data.sharedWithUser.email} ${
          data.disabled ? 'enabled' : 'disabled'
        } successfully`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `${data.disabled ? 'Enabling' : 'Disabling'} user ${data
          .sharedWithUser.name ||
          data.sharedWithUser.email} is failed due to the erorr "${
          commStatus.message
        }"`;
      }
    } else if (action === 'delete') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `User ${data.sharedWithUser.name ||
          data.sharedWithUser.email} deleted successfully`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `Deleting user ${data.sharedWithUser.name ||
          data.sharedWithUser.email} is failed due to the error "${
          commStatus.message
        }"`;
      }
    } else if (action === 'makeOwner') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `An Account Ownership invitation has been sent to ${
          data.sharedWithUser.name
        } (${
          data.sharedWithUser.email
        }).<br/>Once accepted, your account will be converted to a regular user account with Manager access.`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `Request to make user ${data.sharedWithUser.name ||
          data.sharedWithUser
            .email} as account owner is failed due to the erorr "${
          commStatus.message
        }"`;
      }
    }

    return message;
  }

  commStatusHandler(objStatus) {
    const { data, statusHandler } = this.props;

    ['disable', 'makeOwner', 'delete'].forEach(a => {
      if (objStatus[a] && ['success', 'error'].includes(objStatus[a].status)) {
        statusHandler({
          status: objStatus[a].status,
          message: this.getMessageForAction(a, objStatus[a], data),
        });
      }
    });
  }
  render() {
    const { anchorEl } = this.state;
    const { data, integrationId, isAccountOwner } = this.props;
    const user = data;

    return (
      <Fragment>
        <CommStatus
          actionsToMonitor={{
            disable: { action: actionTypes.USER_DISABLE, resourceId: data._id },
            makeOwner: { action: actionTypes.USER_MAKE_OWNER },
            delete: { action: actionTypes.USER_DELETE, resourceId: data._id },
          }}
          autoClearOnComplete
          // actionsToClear={actionsToClear}
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
              {integrationId && user._id !== ACCOUNT_IDS.OWN && (
                <TableCell>
                  <IconButton
                    onClick={() => {
                      this.handleActionClick('edit', user._id);
                    }}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              )}
              {!integrationId && (
                <Fragment>
                  <TableCell>
                    <Switch
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
                        onClick={() => {
                          this.handleActionClick('edit', user._id);
                        }}>
                        Change permissions
                      </MenuItem>
                      <Divider />
                      {user.accepted && (
                        <Fragment>
                          <MenuItem
                            onClick={() => {
                              this.handleActionClick('makeOwner');
                            }}>
                            Make account owner
                          </MenuItem>
                          <Divider />
                        </Fragment>
                      )}
                      <MenuItem
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

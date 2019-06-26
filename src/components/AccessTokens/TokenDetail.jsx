import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';
import { withSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Interval from 'react-interval-rerender';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';
import AuditLogsDialog from '../AuditLog/AuditLogsDialog';
import getAutoPurgeAtAsString from './util';
import { confirmDialog } from '../ConfirmDialog';

const mapDispatchToProps = dispatch => ({
  displayToken: id => {
    dispatch(actions.accessToken.displayToken(id));
  },
  generateToken: id => {
    dispatch(actions.accessToken.generateToken(id));
  },
  revoke: accessToken => {
    dispatch(actions.accessToken.revoke(accessToken));
  },
  reactivate: accessToken => {
    dispatch(actions.accessToken.activate(accessToken));
  },
  deleteAccessToken: id => {
    dispatch(actions.accessToken.deleteAccessToken(id));
  },
});

@hot(module)
class TokenDetail extends Component {
  state = {
    anchorEl: null,
    showTokenStatus: '',
    showAuditLogsDialog: false,
  };

  handleActionsMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleActionsMenuClose = () => {
    this.setState({ anchorEl: null });
  };
  handleAuditLogsDialogClose = () => {
    this.setState({ showAuditLogsDialog: false });
  };

  handleActionClick = action => {
    this.setState({ anchorEl: null });

    const {
      accessToken,
      displayToken,
      generateToken,
      revoke,
      reactivate,
      deleteAccessToken,
      editClickHandler,
    } = this.props;

    switch (action) {
      case 'edit':
        editClickHandler(accessToken._id);
        break;
      case 'audit':
        this.setState({ showAuditLogsDialog: true });
        break;
      case 'display':
        this.setState({ showTokenStatus: 'Getting Token...' });
        displayToken(accessToken._id);
        break;
      case 'generate':
        this.setState({ showTokenStatus: 'Generating Token...' });
        generateToken(accessToken._id);
        break;
      case 'revoke':
        revoke(accessToken);
        break;
      case 'reactivate':
        reactivate(accessToken);
        break;
      case 'delete':
        confirmDialog({
          title: 'Confirm',
          message: 'Are you sure you want to delete this API token?',
          buttons: [
            {
              label: 'Cancel',
            },
            {
              label: 'Yes',
              onClick: () => {
                deleteAccessToken(accessToken._id);
              },
            },
          ],
        });
        break;
      default:
    }
  };
  getMessageForAction(action, commStatus, accessToken) {
    let message;

    if (action === 'deleteAccessToken') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `API token ${accessToken.name ||
          accessToken._id} deleted successfully`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `Deleting API token ${accessToken.name ||
          accessToken._id} failed due to the error "${commStatus.message}"`;
      }
    } /* else if (action === 'update') {
      if (commStatus.status === COMM_STATES.SUCCESS) {
        message = `API token ${accessToken.name || accessToken._id} ${
          accessToken.revoked ? 'reactivated' : 'revoked'
        } successfully`;
      } else if (commStatus.status === COMM_STATES.ERROR) {
        message = `${
          accessToken.revoked ? 'Reactivating' : 'Revoking'
        } API token ${accessToken.name ||
          accessToken._id} is failed due to the error "${commStatus.message}"`;
      }
    } */

    return message;
  }

  commStatusHandler(objStatus) {
    const { accessToken, enqueueSnackbar } = this.props;

    ['deleteAccessToken', 'displayToken', 'generateToken'].forEach(a => {
      if (
        objStatus[a] &&
        [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus[a].status)
      ) {
        this.setState({ showTokenStatus: '' });
        const message = this.getMessageForAction(a, objStatus[a], accessToken);

        if (!message) {
          return;
        }

        enqueueSnackbar(message, {
          variant: objStatus[a].status,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          action: key => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => {
                this.props.closeSnackbar(key);
              }}>
              <CloseIcon />
            </IconButton>
          ),
        });
      }
    });
  }
  render() {
    const { anchorEl, showTokenStatus, showAuditLogsDialog } = this.state;
    const { accessToken, enqueueSnackbar } = this.props;

    return (
      <Fragment>
        <CommStatus
          actionsToMonitor={{
            displayToken: {
              action: actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
              resourceId: accessToken._id,
            },
            generateToken: {
              action: actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
              resourceId: accessToken._id,
            },
            revoke: {
              action: actionTypes.ACCESSTOKEN_REVOKE,
              resourceId: accessToken._id,
            },
            activate: {
              action: actionTypes.ACCESSTOKEN_ACTIVATE,
              resourceId: accessToken._id,
            },
            deleteAccessToken: {
              action: actionTypes.ACCESSTOKEN_DELETE,
              resourceId: accessToken._id,
            },
          }}
          autoClearOnComplete
          commStatusHandler={objStatus => {
            this.commStatusHandler(objStatus);
          }}
        />
        {showAuditLogsDialog && (
          <AuditLogsDialog
            resourceType="accesstokens"
            resourceId={accessToken._id}
            onClose={this.handleAuditLogsDialogClose}
          />
        )}
        <TableRow key={accessToken._id}>
          <TableCell>{accessToken.name}</TableCell>
          <TableCell>{accessToken.description}</TableCell>
          <TableCell>
            {!accessToken.permissions.displayToken && (
              <Typography>
                {accessToken.permissionReasons.displayToken}
              </Typography>
            )}
            {accessToken.permissions.displayToken && (
              <Fragment>
                {accessToken.token && (
                  <Fragment>
                    <Typography>{accessToken.token}</Typography>
                    <CopyToClipboard
                      text={accessToken.token}
                      onCopy={() =>
                        enqueueSnackbar('Token copied to clipboard.', {
                          variant: 'success',
                          anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                          },
                          action: key => (
                            <IconButton
                              key="close"
                              aria-label="Close"
                              color="inherit"
                              onClick={() => {
                                this.props.closeSnackbar(key);
                              }}>
                              <CloseIcon />
                            </IconButton>
                          ),
                        })
                      }>
                      <Button>Click to Copy</Button>
                    </CopyToClipboard>
                  </Fragment>
                )}
                {!accessToken.token &&
                  (showTokenStatus || (
                    <Button
                      onClick={() => {
                        this.handleActionClick('display');
                      }}>
                      Click to Display
                    </Button>
                  ))}
              </Fragment>
            )}
          </TableCell>
          <TableCell>{accessToken.revoked ? 'Revoked' : 'Active'}</TableCell>
          <TableCell>
            {accessToken.fullAccess ? 'Full Access' : 'Custom'}
          </TableCell>
          <TableCell>
            <Interval delay={60 * 1000}>
              {() => getAutoPurgeAtAsString(accessToken.autoPurgeAt)}
            </Interval>
          </TableCell>
          <TableCell>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleActionsMenuClose}>
              {accessToken.permissions.activate && (
                <MenuItem
                  onClick={() => {
                    this.handleActionClick('reactivate');
                  }}>
                  Reactivate token
                </MenuItem>
              )}
              {accessToken.permissions.revoke && (
                <MenuItem
                  onClick={() => {
                    this.handleActionClick('revoke');
                  }}>
                  Revoke token
                </MenuItem>
              )}
              <Divider />
              {accessToken.permissions.generateToken && (
                <MenuItem
                  onClick={() => {
                    this.handleActionClick('generate');
                  }}>
                  Regenerate token
                </MenuItem>
              )}
              {!accessToken.permissions.generateToken && (
                <Tooltip
                  title={accessToken.permissionReasons.generateToken}
                  placement="top">
                  <div>
                    <MenuItem
                      disabled
                      onClick={() => {
                        this.handleActionClick('generate');
                      }}>
                      Regenerate token
                    </MenuItem>
                  </div>
                </Tooltip>
              )}
              <Divider />
              {accessToken.permissions.edit ? (
                <MenuItem
                  onClick={() => {
                    this.handleActionClick('edit');
                  }}>
                  Edit token
                </MenuItem>
              ) : (
                <Tooltip
                  title={accessToken.permissionReasons.edit}
                  placement="top">
                  <div>
                    <MenuItem
                      disabled
                      onClick={() => {
                        this.handleActionClick('edit');
                      }}>
                      Edit token
                    </MenuItem>
                  </div>
                </Tooltip>
              )}
              <Divider />
              <MenuItem
                onClick={() => {
                  this.handleActionClick('audit');
                }}>
                View audit log
              </MenuItem>
              <Divider />
              {accessToken.permissions.delete ? (
                <MenuItem
                  onClick={() => {
                    this.handleActionClick('delete');
                  }}>
                  Delete token
                </MenuItem>
              ) : (
                <Tooltip
                  title={accessToken.permissionReasons.delete}
                  placement="top">
                  <div>
                    <MenuItem
                      disabled
                      onClick={() => {
                        this.handleActionClick('delete');
                      }}>
                      Delete token
                    </MenuItem>
                  </div>
                </Tooltip>
              )}
            </Menu>
            <IconButton onClick={this.handleActionsMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
}

export default withSnackbar(
  connect(
    null,
    mapDispatchToProps
  )(TokenDetail)
);

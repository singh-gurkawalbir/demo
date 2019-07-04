import { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography, Button } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { withSnackbar } from 'notistack';
import moment from 'moment';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { isPurged, getAutoPurgeAtAsString } from './util';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';
import { confirmDialog } from '../ConfirmDialog';
import AuditLogsDialog from '../AuditLog/AuditLogsDialog';
import AccessTokenActionsMenu from './AccessTokenActionsMenu';

function TokenDetail(props) {
  const {
    accessToken,
    editClickHandler,
    enqueueSnackbar,
    closeSnackbar,
  } = props;
  const dispatch = useDispatch();
  const [autoPurge, setAutoPurge] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [showAuditLogsDialog, setShowAuditLogsDialog] = useState(false);
  const isAccessTokenPurged = isPurged(accessToken.autoPurgeAt);

  /** Update purge status whenever autoPurgeAt changes */
  useEffect(() => {
    setAutoPurge(getAutoPurgeAtAsString(accessToken.autoPurgeAt));

    /** Check and update purge status every minute until the token is purged */
    if (accessToken.autoPurgeAt && moment().diff(accessToken.autoPurgeAt) < 0) {
      const updateAutoPurgeTimer = setInterval(() => {
        setAutoPurge(getAutoPurgeAtAsString(accessToken.autoPurgeAt));
      }, 60 * 1000);

      return () => {
        clearTimeout(updateAutoPurgeTimer);
      };
    }
  }, [accessToken.autoPurgeAt]);

  function handleAuditLogsDialogClose() {
    setShowAuditLogsDialog(false);
  }

  function handleActionClick(action) {
    switch (action) {
      case 'edit':
        editClickHandler(accessToken._id);
        break;
      case 'audit':
        setShowAuditLogsDialog(true);
        break;
      case 'display':
        setTokenStatus('Getting Token...');

        return dispatch(actions.accessToken.displayToken(accessToken._id));
      case 'generate':
        setTokenStatus('Generating Token...');

        return dispatch(actions.accessToken.generateToken(accessToken._id));
      case 'revoke':
        return dispatch(actions.accessToken.revoke(accessToken._id));
      case 'reactivate':
        return dispatch(actions.accessToken.activate(accessToken._id));
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
                dispatch(
                  actions.accessToken.deleteAccessToken(accessToken._id)
                );
              },
            },
          ],
        });
        break;
      default:
    }
  }

  function commStatusHandler(objStatus) {
    const messages = {
      deleteAccessToken: {
        [COMM_STATES.SUCCESS]: `API token ${accessToken.name ||
          accessToken._id} deleted successfully`,
        [COMM_STATES.ERROR]: `Deleting API token ${accessToken.name ||
          accessToken._id} failed due to the error "${objStatus.message}"`,
      },
    };

    ['deleteAccessToken', 'displayToken', 'generateToken'].forEach(a => {
      if (
        objStatus[a] &&
        [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus[a].status)
      ) {
        setTokenStatus(null);

        if (!messages[a] || !messages[a][objStatus[a].status]) {
          return;
        }

        enqueueSnackbar(messages[a][objStatus[a].status], {
          variant: objStatus[a].status,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          // eslint-disable-next-line react/display-name
          action: key => (
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => {
                closeSnackbar(key);
              }}>
              <CloseIcon />
            </IconButton>
          ),
        });
      }
    });
  }

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
          commStatusHandler(objStatus);
        }}
      />
      {showAuditLogsDialog && (
        <AuditLogsDialog
          resourceType="accesstokens"
          resourceId={accessToken._id}
          onClose={handleAuditLogsDialogClose}
        />
      )}
      <TableRow>
        <TableCell>{accessToken.name}</TableCell>
        <TableCell>{accessToken.description}</TableCell>
        <TableCell>
          {!accessToken.permissions.displayToken && (
            <Typography>
              {accessToken.permissionReasons.displayToken}
            </Typography>
          )}
          {isAccessTokenPurged ? (
            <Typography>Purged</Typography>
          ) : (
            <Fragment>
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
                            // eslint-disable-next-line react/display-name
                            action: key => (
                              <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={() => {
                                  closeSnackbar(key);
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
                    (tokenStatus || (
                      <Button
                        onClick={() => {
                          handleActionClick('display');
                        }}>
                        Click to Display
                      </Button>
                    ))}
                </Fragment>
              )}
            </Fragment>
          )}
        </TableCell>
        <TableCell>{accessToken.revoked ? 'Revoked' : 'Active'}</TableCell>
        <TableCell>
          {accessToken.fullAccess ? 'Full Access' : 'Custom'}
        </TableCell>
        <TableCell>{autoPurge}</TableCell>
        <TableCell>
          {!isAccessTokenPurged && (
            <AccessTokenActionsMenu
              accessToken={accessToken}
              onActionClick={handleActionClick}
            />
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default withSnackbar(TokenDetail);

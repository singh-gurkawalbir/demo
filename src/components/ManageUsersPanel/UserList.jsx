import { Fragment, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  ACCOUNT_IDS,
} from '../../utils/constants';
import UserDetail from './UserDetail';
import CloseIcon from '../icons/CloseIcon';
import Help from '../Help';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  helpIcon: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function UserList({ integrationId, onEditUserClick }) {
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const permissions = useSelector(state => selectors.userPermissions(state));
  // Copied the existing logic. Todo: Refactor this selector
  const users = useSelector(state => {
    let _users = [];

    if (permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
      if (integrationId) {
        _users = selectors.integrationUsersForOwner(state, integrationId);
      } else {
        _users = selectors.orgUsers(state);
      }
    } else if (integrationId) {
      _users = selectors.integrationUsers(state, integrationId);
    }

    if (integrationId && users && users.length > 0) {
      const accountOwner = selectors.accountOwner(state);

      _users = [
        {
          _id: ACCOUNT_IDS.OWN,
          accepted: true,
          accessLevel: INTEGRATION_ACCESS_LEVELS.OWNER,
          sharedWithUser: accountOwner,
        },
        ..._users,
      ];
    }

    return _users;
  });
  const requestIntegrationAShares = useCallback(() => {
    if (integrationId) {
      if (!users) {
        dispatch(
          actions.resource.requestCollection(
            ['integrations', integrationId, 'ashares'].join('/')
          )
        );
      }
    }
  }, [dispatch, integrationId, users]);

  useEffect(() => {
    requestIntegrationAShares();
  }, [requestIntegrationAShares]);

  const statusHandler = ({ status, message }) => {
    enquesnackbar(message, {
      variant: status,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      // eslint-disable-next-line react/display-name
      action: key => (
        <IconButton
          data-test="closeUserListSnackbar"
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
  };

  const isAccountOwner =
    permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;

  return (
    <Fragment>
      <div className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>
                Access Level
                <Help
                  title="Access Level"
                  helpKey="users.accesslevel"
                  caption="users.accesslevel"
                  className={classes.helpIcon}
                />
              </TableCell>
              <TableCell>
                Status
                <Help
                  title="Status"
                  helpKey="users.status"
                  caption="users.status"
                  className={classes.helpIcon}
                />
              </TableCell>
              {isAccountOwner && (
                <Fragment>
                  {!integrationId && (
                    <TableCell>
                      Enable User
                      <Help
                        title="Enable User"
                        helpKey="users.offOn"
                        caption="users.offOn"
                        className={classes.helpIcon}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    Actions
                    <Help
                      title="Actions"
                      helpKey="users.actions"
                      caption="users.actions"
                      className={classes.helpIcon}
                    />
                  </TableCell>
                </Fragment>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map(user => (
                <UserDetail
                  key={user._id}
                  user={user}
                  integrationId={integrationId}
                  isAccountOwner={isAccountOwner}
                  editClickHandler={onEditUserClick}
                  statusHandler={({ status, message }) => {
                    statusHandler({ status, message });
                  }}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}

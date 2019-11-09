import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import UserDialog from './UserDialog';
import * as selectors from '../../reducers';
import actions from '../../actions';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  ACCOUNT_IDS,
} from '../../utils/constants';
import UserDetail from './UserDetail';
import { COMM_STATES } from '../../reducers/comms';

const mapStateToProps = (state, { integrationId }) => {
  const permissions = selectors.userPermissions(state);
  let users = [];

  if (permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
    if (integrationId) {
      users = selectors.integrationUsersForOwner(state, integrationId);
    } else {
      users = selectors.orgUsers(state);
    }
  } else if (integrationId) {
    users = selectors.integrationUsers(state, integrationId);
  }

  if (integrationId && users && users.length > 0) {
    const accountOwner = selectors.accountOwner(state);

    users = [
      {
        _id: ACCOUNT_IDS.OWN,
        accepted: true,
        accessLevel: INTEGRATION_ACCESS_LEVELS.OWNER,
        sharedWithUser: accountOwner,
      },
      ...users,
    ];
  }

  return {
    users,
    permissions,
  };
};

const mapDispatchToProps = dispatch => ({
  requestIntegrationAShares: integrationId => {
    dispatch(
      actions.resource.requestCollection(
        ['integrations', integrationId, 'ashares'].join('/')
      )
    );
  },
});

@withStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing(2),
    float: 'left',
  },
  inviteUserButton: {
    margin: theme.spacing(1),
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
}))
class UserList extends Component {
  state = {
    selectedUserId: undefined,
    showUserDialog: false,
  };

  componentDidMount() {
    const { integrationId, requestIntegrationAShares, users } = this.props;

    if (integrationId) {
      if (!users) {
        requestIntegrationAShares(integrationId);
      }
    }
  }

  statusHandler({ status, message }) {
    const { enqueueSnackbar } = this.props;

    enqueueSnackbar(message, {
      variant: status,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
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
    this.setState({ showUserDialog: false });
  }
  handleActionClick(action, userId) {
    switch (action) {
      case 'create':
        this.setState({
          showUserDialog: true,
          selectedUserId: undefined,
        });
        break;
      case 'edit':
        this.setState({
          showUserDialog: true,
          selectedUserId: userId,
        });
        break;
      default:
    }
  }

  render() {
    const { showUserDialog, selectedUserId } = this.state;
    const { classes, users, integrationId, permissions } = this.props;
    const isAccountOwner =
      permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;

    return (
      <Fragment>
        {showUserDialog && (
          <UserDialog
            id={selectedUserId}
            onCancelClick={() => {
              this.setState({ showUserDialog: false });
            }}
            successHandler={message => {
              this.statusHandler({ status: COMM_STATES.SUCCESS, message });
            }}
          />
        )}
        <div className={classes.root}>
          <div>
            {isAccountOwner && (
              <Button
                data-test="inviteUser"
                className={classes.inviteUserButton}
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.handleActionClick('create');
                }}>
                Invite User
              </Button>
            )}
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Access Level</TableCell>
                <TableCell>Status</TableCell>
                {isAccountOwner && (
                  <Fragment>
                    {!integrationId && <TableCell>Off/On</TableCell>}
                    <TableCell>Actions</TableCell>
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
                    editClickHandler={userId => {
                      this.handleActionClick('edit', userId);
                    }}
                    statusHandler={({ status, message }) => {
                      this.statusHandler({ status, message });
                    }}
                  />
                ))}
            </TableBody>
          </Table>
        </div>
      </Fragment>
    );
  }
}

export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserList)
);

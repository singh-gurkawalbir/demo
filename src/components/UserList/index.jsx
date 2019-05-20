import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import UserDialog from './UserDialog';
import * as selectors from '../../reducers';
import actions from '../../actions';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  ACCOUNT_IDS,
} from '../../utils/constants';
import UserDetail from './UserDetail';
import Notifier, { openSnackbar } from '../Notifier';

const mapStateToProps = (state, { integrationId }) => {
  const permissions = selectors.userPermissions(state);
  let users = [];

  if (permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER) {
    const orgUsers = selectors.orgUsers(state);

    if (integrationId) {
      let integrationAccessLevel;

      orgUsers.forEach(u => {
        if (
          [
            USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
            USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
          ].includes(u.accessLevel)
        ) {
          users.push({
            ...u,
            accessLevel:
              u.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MANAGE
                ? INTEGRATION_ACCESS_LEVELS.MANAGE
                : INTEGRATION_ACCESS_LEVELS.MONITOR,
            integrationAccessLevel: undefined,
          });
        } else if (u.accessLevel === USER_ACCESS_LEVELS.TILE) {
          integrationAccessLevel = u.integrationAccessLevel.find(
            ial => ial._integrationId === integrationId
          );

          if (integrationAccessLevel) {
            users.push({
              ...u,
              accessLevel: integrationAccessLevel.accessLevel,
              integrationAccessLevel: undefined,
            });
          }
        }
      });
    } else {
      users = orgUsers;
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
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  inviteUserButton: {
    margin: theme.spacing.unit,
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
    openSnackbar({
      message,
      variant: status,
      autoHideDuration: 10000,
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
        <Notifier />
        {showUserDialog && (
          <UserDialog
            data={{ _id: selectedUserId }}
            onCancelClick={() => {
              this.setState({ showUserDialog: false });
            }}
            successHandler={message => {
              this.statusHandler({ status: 'success', message });
            }}
          />
        )}
        <div className={classes.root}>
          <div>
            <Typography className={classes.title} variant="h4">
              {integrationId
                ? `Integration #${integrationId} Users`
                : 'Org Users'}
            </Typography>
            {isAccountOwner && (
              <Button
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
                    data={user}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);

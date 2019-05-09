import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from 'mdi-react/EditIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  ACCOUNT_IDS,
} from '../../utils/constants';

const mapStateToProps = (state, { integrationId }) => {
  const permissions = selectors.userPermissions(state);
  let users;

  if (integrationId) {
    users = selectors.integrationUsers(state, integrationId);

    if (users && users.length > 0) {
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
  } else {
    users = selectors.orgUsers(state);
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
    showDialog: false,
  };
  handleClick = () => {
    this.setState({
      showDialog: !this.state.showDialog,
    });
  };
  componentDidMount() {
    const { integrationId, requestIntegrationAShares, users } = this.props;

    if (integrationId) {
      if (!users) {
        requestIntegrationAShares(integrationId);
      }
    }
  }
  render() {
    const { showDialog } = this.state;
    const { classes, users, integrationId, permissions } = this.props;
    const isAccountOwner =
      permissions.accessLevel !== USER_ACCESS_LEVELS.ACCOUNT_OWNER;

    return (
      <Fragment>
        {showDialog && 'InviteUser'}
        <div className={classes.root}>
          <div>
            <Typography className={classes.title} variant="h4">
              {integrationId
                ? `Integration #${integrationId} Users`
                : 'Org Users'}
            </Typography>
            <Button
              className={classes.inviteUserButton}
              variant="contained"
              color="secondary"
              onClick={this.handleClick}>
              Invite User
            </Button>
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Access Level</TableCell>
                <TableCell>Status</TableCell>
                {isAccountOwner && (
                  <Fragment>
                    <TableCell>Off/On</TableCell>
                    <TableCell>Actions</TableCell>
                  </Fragment>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell component="th" scope="row">
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
                      {user.accepted && 'Accepted'}
                      {user.dismissed && 'Dismissed'}
                      {!user.accepted && !user.dismissed && 'Pending'}
                    </TableCell>
                    {isAccountOwner && (
                      <Fragment>
                        <TableCell>
                          <Switch checked={!user.disabled} />
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </Fragment>
                    )}
                  </TableRow>
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

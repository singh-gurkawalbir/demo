import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
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
// TODO (Azhar) : to work on styling
// helpcontent is showing as bold text

@withStyles({
  root: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})
class UserList extends Component {
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
  }

  render() {
    const {
      classes,
      users,
      integrationId,
      permissions,
      onEditUserClick,
    } = this.props;
    const isAccountOwner =
      permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER;

    return (
      <Fragment>
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  User
                  <Help
                    helpKey="User"
                    helpText="users.user"
                    caption="users.user"
                  />
                </TableCell>
                <TableCell>
                  Access Level
                  <Help
                    helpText="ffdfawerw3434t54  ewrr3t rt"
                    title="Access Level"
                    helpKey="users.accesslevel"
                    caption="users.accesslevel"
                  />
                </TableCell>
                <TableCell>
                  Status
                  <Help
                    title="Status"
                    helpKey="users.status"
                    caption="users.status"
                  />
                </TableCell>
                {isAccountOwner && (
                  <Fragment>
                    {!integrationId && (
                      <TableCell>
                        Off/On
                        <Help
                          title="Off/On"
                          helpKey="users.offOn"
                          caption="users.offOn"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      Actions
                      <Help
                        title="Actions"
                        helpKey="users.actions"
                        caption="users.actions"
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

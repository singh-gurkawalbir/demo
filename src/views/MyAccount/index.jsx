import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import loadable from '../../utils/loadable';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import CeligoPageBar from '../../components/CeligoPageBar';
import TransfersIcon from '../../components/icons/TransfersIcon';
import SingleUserIcon from '../../components/icons/SingleUserIcon';
import UsersIcon from '../../components/icons/GroupOfUsersIcon';
import UsersPanel from '../../components/ManageUsersPanel';
import KnowledgeBaseIcon from '../../components/icons/KnowledgeBaseIcon';
import AuditLogIcon from '../../components/icons/AuditLogIcon';
import ResourceDrawer from '../../components/drawer/Resource';
import Tabs from '../Integration/common/Tabs';

const mapStateToProps = state => {
  const permissions = selectors.userPermissions(state);

  return {
    permissions,
  };
};

const Profile = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Profile' */ './Profile')
);
const Subscription = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Users' */ './Subscription')
);
const Audit = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Audit' */ './Audit')
);
const Transfers = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Transfers' */ './Transfers/index')
);
const tabs = [
  {
    path: 'subscription',
    label: 'Subscription',
    Icon: KnowledgeBaseIcon,
    Panel: Subscription,
  },
  {
    path: 'profile',
    label: 'Profile',
    Icon: SingleUserIcon,
    Panel: Profile,
  },
  { path: 'users', label: 'Users', Icon: UsersIcon, Panel: UsersPanel },
  {
    path: 'audit',
    label: 'Audit log',
    Icon: AuditLogIcon,
    Panel: Audit,
  },
  {
    path: 'transfers',
    label: 'Transfers',
    Icon: TransfersIcon,
    Panel: Transfers,
  },
];

// TODO: Ashok if these CSS are not being used then we can remove it.
@hot(module)
@withStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    // color: theme.palette.action.active,
  },
  appFrame: {
    padding: theme.spacing(1),
  },
  about: {
    padding: theme.spacing(1),
  },
  root: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'flex-start',
  },
  leftElement: {
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing(1),
    minHeight: 500,
    zIndex: 0,
  },
  rightElement: {
    background: theme.palette.background.paper,
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  activeLink: {
    fontWeight: 'bold',
  },
  flex: {
    flex: 1,
    zIndex: 1,
  },
  wrapperProfile: {
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
    margin: theme.spacing(3),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  tabsAccount: {
    padding: theme.spacing(3),
  },
}))
class MyAccount extends Component {
  render() {
    const { match, permissions, classes } = this.props;

    return (
      <Fragment>
        <CeligoPageBar
          title={
            permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
              ? 'My account'
              : 'My profile'
          }
        />
        {permissions.accessLevel !== USER_ACCESS_LEVELS.ACCOUNT_OWNER ? (
          <div className={classes.wrapperProfile}>
            <Profile />
          </div>
        ) : (
          <Fragment>
            <ResourceDrawer match={match} />
            <Tabs tabs={tabs} match={match} className={classes.tabsAccount} />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(MyAccount);

import React from 'react';
import { makeStyles } from '@material-ui/core/';
import { useSelector } from 'react-redux';
import loadable from '../../utils/loadable';
import { selectors } from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import CeligoPageBar from '../../components/CeligoPageBar';
import TransfersIcon from '../../components/icons/TransfersIcon';
import SecurityIcon from '../../components/icons/SecurityIcon';
import SingleUserIcon from '../../components/icons/SingleUserIcon';
import UsersIcon from '../../components/icons/GroupOfUsersIcon';
import UsersPanel from '../../components/ManageUsersPanel';
import KnowledgeBaseIcon from '../../components/icons/KnowledgeBaseIcon';
import AuditLogIcon from '../../components/icons/AuditLogIcon';
import ResourceDrawer from '../../components/drawer/Resource';
import Tabs from '../Integration/common/Tabs';
import retry from '../../utils/retry';

const Profile = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount.Profile' */ './Profile'))
);
const Subscription = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount.Users' */ './Subscription'))
);
const Audit = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount.Audit' */ './Audit'))
);
const Transfers = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount.Transfers' */ './Transfers/index'))
);
const Security = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount.Security' */ './Security/index'))
);

const tabs = [
  {
    path: 'profile',
    label: 'Profile',
    Icon: SingleUserIcon,
    Panel: Profile,
  },
  { path: 'users', label: 'Users', Icon: UsersIcon, Panel: UsersPanel },
  {
    path: 'subscription',
    label: 'Subscription',
    Icon: KnowledgeBaseIcon,
    Panel: Subscription,
  },
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
  {
    path: 'security',
    label: 'Security',
    Icon: SecurityIcon,
    Panel: Security,
  },
];

const useStyles = makeStyles(theme => ({
  wrapperProfile: {
    margin: theme.spacing(3),
  },
  tabsAccount: {
    padding: theme.spacing(3),
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
}));

export default function MyAccount({ match }) {
  const classes = useStyles();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));
  const hasSSOPrimaryAccountAccess = useSelector(state => selectors.ssoPrimaryAccounts(state).length);

  const tabsForManageOrMonitorUser = tabs.filter(tab => tab.path === 'profile' || (hasSSOPrimaryAccountAccess && tab.path === 'security'));
  const availableTabs = isAccountOwnerOrAdmin ? tabs : tabsForManageOrMonitorUser;

  return (
    <>
      <CeligoPageBar
        title={
            permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
              ? 'My account'
              : 'My profile'
          }
        />
      <ResourceDrawer match={match} />
      <Tabs tabs={availableTabs} match={match} className={classes.tabsAccount} />
    </>
  );
}

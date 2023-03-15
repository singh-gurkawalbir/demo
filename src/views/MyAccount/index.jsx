import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import loadable from '../../utils/loadable';
import { selectors } from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../constants';
import CeligoPageBar from '../../components/CeligoPageBar';
import TransfersIcon from '../../components/icons/TransfersIcon';
import DataRetentionIcon from '../../components/icons/DataRetentionIcon';
import SecurityIcon from '../../components/icons/SecurityIcon';
import SingleUserIcon from '../../components/icons/SingleUserIcon';
import UsersIcon from '../../components/icons/GroupOfUsersIcon';
import UsersPanel from '../../components/ManageUsersPanel';
import KnowledgeBaseIcon from '../../components/icons/KnowledgeBaseIcon';
import AuditLogIcon from '../../components/icons/AuditLogIcon';
import ResourceDrawer from '../../components/drawer/Resource';
import Tabs from '../Integration/common/Tabs';
import retry from '../../utils/retry';
import PageContent from '../../components/PageContent';

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
const DataRetention = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount.DataRetention' */ './DataRetention/index'))
);

const SECURITY_TAB = {
  path: 'security',
  label: 'Security',
  Icon: SecurityIcon,
  Panel: Security,
};

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
  SECURITY_TAB,
  {
    path: 'dataretention',
    label: 'Data retention',
    Icon: DataRetentionIcon,
    Panel: DataRetention,
  },
];

const useStyles = makeStyles(theme => ({
  wrapperProfile: {
    margin: theme.spacing(3),
  },
  tabsAccount: {
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
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const tabsForManageOrMonitorUser = tabs.filter(tab => tab.path === 'profile' || tab.path === 'security');
  const availableTabs = isAccountOwnerOrAdmin ? tabs : tabsForManageOrMonitorUser;
  const myAccountTabs = isMFASetupIncomplete ? [SECURITY_TAB] : availableTabs;

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
      <PageContent>
        <Tabs tabs={myAccountTabs} match={match} className={classes.tabsAccount} />
      </PageContent>
    </>
  );
}

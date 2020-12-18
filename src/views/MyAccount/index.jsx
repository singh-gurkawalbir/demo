import React from 'react';
import { makeStyles } from '@material-ui/core/';
import { useSelector } from 'react-redux';
import loadable from '../../utils/loadable';
import { selectors } from '../../reducers';
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
];

const useStyles = makeStyles(theme => ({
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
}));

export default function MyAccount({ match }) {
  const classes = useStyles();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const isAccountOwnerOrAdmin = useSelector(state => selectors.isAccountOwnerOrAdmin(state));

  return (
    <>
      <CeligoPageBar
        title={
            permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
              ? 'My account'
              : 'My profile'
          }
        />
      {!isAccountOwnerOrAdmin ? (
        <div className={classes.wrapperProfile}>
          <Profile />
        </div>
      ) : (
        <>
          <ResourceDrawer match={match} />
          <Tabs tabs={tabs} match={match} className={classes.tabsAccount} />
        </>
      )}
    </>
  );
}

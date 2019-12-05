// import clsx from 'clsx';
import { useSelector } from 'react-redux';
import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import AuditLogSection from './sections/AuditLog';
import SubscriptionSection from './sections/Subscription';
import NotificationsSection from './sections/Notifications';
import UsersSection from './sections/Users';
import UninstallSection from './sections/Uninstall';
import ApiTokensSection from './sections/ApiTokens';
import NotificationsIcon from '../../../../../components/icons/NotificationsIcon';
import AuditLogIcon from '../../../../../components/icons/AuditLogIcon';
import GroupOfUsersIcon from '../../../../../components/icons/GroupOfUsersIcon';
import TokensApiIcon from '../../../../../components/icons/TokensApiIcon';
import SubscriptionIcon from '../../../../../components/icons/SettingsIcon';
import UninstallIcon from '../../../../../components/icons/TrashIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.common.white,
  },
  container: {
    display: 'flex',
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
    overflowX: 'scroll',
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  icon: {
    marginRight: 5,
  },
}));
const allSections = [
  {
    path: 'notifications',
    label: 'Notifications',
    Section: NotificationsSection,
    id: 'notifications',
    Icon: NotificationsIcon,
  },
  {
    path: 'audit',
    label: 'Audit log',
    Section: AuditLogSection,
    id: 'auditLog',
    Icon: AuditLogIcon,
  },
  {
    path: 'users',
    label: 'Users',
    Section: UsersSection,
    id: 'users',
    Icon: GroupOfUsersIcon,
  },
  {
    path: 'subscription',
    label: 'Subscription',
    Section: SubscriptionSection,
    id: 'subscription',
    Icon: SubscriptionIcon,
  },
  {
    path: 'uninstall',
    label: 'Uninstall',
    Section: UninstallSection,
    id: 'uninstall',
    Icon: UninstallIcon,
  },
  {
    path: 'apitoken',
    label: 'API tokens',
    Section: ApiTokensSection,
    id: 'apitoken',
    Icon: TokensApiIcon,
  },
];

export default function AdminPanel({ integrationId, ...sectionProps }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const permissions = useSelector(state => selectors.userPermissions(state));
  const showAPITokens = permissions.accesstokens.view;
  const availableSections = showAPITokens
    ? allSections
    : // remove api token (last) section;
      allSections.slice(0, allSections.length - 1);

  // if someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because some users have different sets of available
  // sections.
  if (match.isExact) {
    // no section provided.
    return (
      <Redirect push={false} to={`${match.url}/${availableSections[0].path}`} />
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.subNav}>
          <List>
            {availableSections.map(({ path, label, id, Icon }) => (
              <ListItem key={path}>
                <Icon className={classes.icon} />
                <NavLink
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={path}
                  data-test={id}>
                  {label}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </div>
        <div className={classes.content}>
          <Switch>
            {availableSections.map(({ path, Section }) => (
              <Route key={path} path={`${match.url}/${path}`}>
                <Section integrationId={integrationId} {...sectionProps} />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

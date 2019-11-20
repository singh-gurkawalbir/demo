// import clsx from 'clsx';
import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem } from '@material-ui/core';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import AuditLogSection from './sections/AuditLog';
import SubscriptionSection from './sections/Subscription';
import NotificationsSection from './sections/Notifications';
import UsersSection from './sections/Users';
import UninstallSection from './sections/Uninstall';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
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
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));
const allSections = [
  {
    path: 'notifications',
    label: 'Notifications',
    Section: NotificationsSection,
    id: 'notifications',
  },
  {
    path: 'audit',
    label: 'Audit log',
    Section: AuditLogSection,
    id: 'auditLog',
  },
  { path: 'users', label: 'Users', Section: UsersSection, id: 'users' },
  {
    path: 'subscription',
    label: 'Subscription',
    Section: SubscriptionSection,
    id: 'subscription',
  },
  {
    path: 'uninstall',
    label: 'Uninstall',
    Section: UninstallSection,
    id: 'uninstall',
  },
];

export default function AdminPanel({ integrationId, ...sectionProps }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const availableSections =
    integrationId === STANDALONE_INTEGRATION.id
      ? allSections.slice(0, allSections.length - 1) // remove readme (last) section
      : allSections;

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
            {availableSections.map(({ path, label, id }) => (
              <ListItem key={path}>
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

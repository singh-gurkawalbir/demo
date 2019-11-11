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
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';
import AuditLogSection from './sections/AuditLog';
import ReadmeSection from './sections/Readme';
import NotificationsSection from './sections/Notifications';
import UsersSection from './sections/Users';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    backgroundColor: theme.palette.common.white,
  },
  container: {
    display: 'flex',
  },
  subNav: {
    width: 200,
    // height: '100%',
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
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
  },
  { path: 'audit', label: 'Audit log', Section: AuditLogSection },
  { path: 'users', label: 'Users', Section: UsersSection },
  { path: 'readme', label: 'Readme', Section: ReadmeSection },
];

export default function AdminPanel({ integrationId }) {
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
            {availableSections.map(({ path, label }) => (
              <ListItem key={path}>
                <NavLink
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={path}>
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
                <Section integrationId={integrationId} />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

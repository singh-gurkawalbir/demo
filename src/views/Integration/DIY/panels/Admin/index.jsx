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
import ReadmeSection from './sections/Readme';
import NotificationsSection from './sections/Notifications';
import UsersSection from './sections/Users';
import NotificationsIcon from '../../../../../components/icons/NotificationsIcon';
import AuditLogIcon from '../../../../../components/icons/AuditLogIcon';
import usersIcon from '../../../../../components/icons/GroupOfUsersIcon';
import ReadmeIcon from '../../../../../components/icons/ShowContentIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  container: {
    display: 'flex',
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
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
    Icon: usersIcon,
  },
  {
    path: 'readme',
    label: 'Readme',
    Section: ReadmeSection,
    id: 'readMe',
    Icon: ReadmeIcon,
  },
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
                <Section integrationId={integrationId} />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

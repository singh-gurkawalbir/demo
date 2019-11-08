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
import GeneralSection from './sections/General';
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
}));

export default function AdminPanel({ integrationId }) {
  const classes = useStyles();
  const match = useRouteMatch();

  if (match.isExact) {
    return <Redirect push={false} to={`${match.url}/notifications`} />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.subNav}>
          <List>
            {integrationId !== STANDALONE_INTEGRATION.id && (
              <ListItem>
                <NavLink to="general">General</NavLink>
              </ListItem>
            )}
            <ListItem>
              <NavLink to="users">Users</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="audit">Audit Log</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="notifications">Notifications</NavLink>
            </ListItem>
          </List>
        </div>
        <div className={classes.content}>
          <Switch>
            <Route path={`${match.url}/audit`}>
              <AuditLogSection integrationId={integrationId} />
            </Route>
            <Route path={`${match.url}/general`}>
              <GeneralSection integrationId={integrationId} />
            </Route>
            <Route path={`${match.url}/notifications`}>
              <NotificationsSection integrationId={integrationId} />
            </Route>
            <Route path={`${match.url}/users`}>
              <UsersSection integrationId={integrationId} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

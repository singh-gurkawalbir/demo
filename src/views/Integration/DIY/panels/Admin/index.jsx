import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem } from '@material-ui/core';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import ReadmeSection from './sections/Readme';
import NotificationsSection from './sections/Notifications';
import GeneralSection from './sections/General';
import * as selectors from '../../../../../reducers';

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
    path: 'general',
    label: 'General',
    Section: GeneralSection,
    id: 'general',
  },
  {
    path: 'notifications',
    label: 'Notifications',
    Section: NotificationsSection,
    id: 'notifications',
  },
  {
    path: 'readme',
    label: 'Readme',
    Section: ReadmeSection,
    id: 'readMe',
  },
];

export default function AdminPanel({ integrationId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const developerModeOn = useSelector(state => selectors.developerMode(state));
  const sectionsToHide = [];

  if (integrationId === STANDALONE_INTEGRATION.id) {
    sectionsToHide.push('readme');
  }

  if (!developerModeOn) {
    sectionsToHide.push('settings');
  }

  const availableSections = allSections.filter(
    sec => !sectionsToHide.includes(sec.id)
  );

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
                <Section integrationId={integrationId} />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

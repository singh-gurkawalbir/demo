import React from 'react';
import { useSelector } from 'react-redux';
import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { List, ListItem, Box } from '@mui/material';
import { selectors } from '../../../../../reducers';
import SubscriptionSection from './sections/Subscription';
import UninstallSection from './sections/Uninstall';
import ApiTokensSection from './sections/ApiTokens';

const useStyles = makeStyles(theme => ({
  listItem: {
    color: theme.palette.secondary.main,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));
const allSections = [
  {
    path: 'apitoken',
    label: 'API tokens',
    Section: ApiTokensSection,
    id: 'apitoken',
  },
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

export default function AdminPanel({
  integrationId,
  childId,
  ...sectionProps
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const showAPITokens = useSelector(
    state => selectors.resourcePermissions(state, 'accesstokens').view && !childId
  );
  const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, integrationId));
  const filterTabs = [];

  if (!showAPITokens) {
    filterTabs.push('apitoken');
  }
  if (!canUninstall) {
    filterTabs.push('uninstall');
  }

  const availableSections = allSections.filter(sec =>
    !filterTabs.includes(sec.id)
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
    <Box
      sx={{
        padding: theme => theme.spacing(0),
        border: '1px solid',
        borderColor: theme => theme.palette.secondary.lightest,
        backgroundColor: theme => theme.palette.background.paper,
      }}>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            minWidth: 200,
            borderRight: theme => `solid 1px ${theme.palette.secondary.lightest}`,
            paddingTop: theme => theme.spacing(2),
          }}>
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
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            paddingBottom: theme => theme.spacing(3),
            overflowX: 'auto',
          }}>
          <Switch>
            {availableSections.map(({ path, Section }) => (
              <Route key={path} path={`${match.url}/${path}`}>
                <Section
                  integrationId={integrationId}
                  childId={childId}
                  {...sectionProps}
                />
              </Route>
            ))}
          </Switch>
        </Box>
      </Box>
    </Box>
  );
}

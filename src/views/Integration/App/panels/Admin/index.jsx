import { useSelector } from 'react-redux';
import React from 'react';
import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import SubscriptionSection from './sections/Subscription';
import GeneralSection from './sections/General';
import UninstallSection from './sections/Uninstall';
import ApiTokensSection from './sections/ApiTokens';

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
}));
const allSections = [
  {
    path: 'general',
    label: 'General',
    Section: GeneralSection,
    id: 'general',
  },
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
  storeId,
  ...sectionProps
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const showAPITokens = useSelector(
    state => selectors.resourcePermissions(state, 'accesstokens').view
  );
  const hideGeneralTab = useSelector(
    state => !selectors.hasGeneralSettings(state, integrationId, storeId)
  );
  const filterTabs = [];

  if (hideGeneralTab) {
    filterTabs.push('general');
  }

  if (!showAPITokens) {
    filterTabs.push('apitoken');
  }

  const availableSections = allSections.filter(sec =>
    filterTabs.includes(sec.id)
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
                <Section
                  integrationId={integrationId}
                  storeId={storeId}
                  {...sectionProps}
                />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

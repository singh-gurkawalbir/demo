import React from 'react';
import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { List, ListItem } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../../../../reducers';
import ReadmeSection from './sections/Readme';
import GeneralSection from './sections/General';
import ApiTokensSection from './sections/ApiTokens';
import SubscriptionSection from './sections/Subscription';
import UninstallSection from './sections/Uninstall';
import { getAdminLevelTabs } from '../../../../../utils/integrationApps';

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
    path: 'readme',
    label: 'Readme',
    Section: ReadmeSection,
    id: 'readme',
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
  }
];
const emptyObj = {};

export default function AdminPanel({ integrationId, childId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const isParent = !childId || (childId === integrationId);
  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));
  const {
    isIntegrationApp,
    supportsChild,
  } = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration) {
      return {
        isIntegrationApp: !!integration._connectorId,
        supportsChild: !!(integration && integration.initChild && integration.initChild.function)
      };
    }

    return emptyObj;
  }, shallowEqual);
  const children = useSelector(
    state => selectors.integrationChildren(state, integrationId),
    shallowEqual
  );
  const sectionsToShow = getAdminLevelTabs({
    integrationId,
    children,
    isIntegrationApp,
    isParent,
    supportsChild,
    isMonitorLevelUser
  });

  const availableSections = allSections.filter(
    sec => sectionsToShow.includes(sec.id)
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
                <Section integrationId={integrationId} childId={childId} />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

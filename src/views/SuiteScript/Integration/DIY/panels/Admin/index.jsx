import { List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  NavLink,
  Redirect, Route,
  Switch,
  useRouteMatch
} from 'react-router-dom';
import actions from '../../../../../../actions';
import * as selectors from '../../../../../../reducers';
import { isJavaFlow } from '../../../../../../utils/suiteScript';
import LegacySection from './sections/Legacy';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';

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
    path: 'legacy',
    label: 'Legacy',
    Section: LegacySection,
    id: 'legacy',
  },
];

export const useLoadSuiteScriptSettings = ({
  ssLinkedConnectionId,
  integrationId,
}) => {
  const dispatch = useDispatch();

  const {hasData: hasSettingsMetadata} = useSelector(state => selectors.suiteScriptResourceStatus(state, {
    ssLinkedConnectionId,
    integrationId,
    resourceType: 'settings',
  }));
  useEffect(() => {
    if (!hasSettingsMetadata) { dispatch(actions.suiteScript.resource.request('settings', ssLinkedConnectionId, integrationId)); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {hasSettingsMetadata};
};
function AdminPanel({ ssLinkedConnectionId, integrationId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const hasJavaFlows = useSelector(state =>
    selectors
      .suiteScriptResourceList(state, {
        resourceType: 'flows',
        integrationId,
        ssLinkedConnectionId,
      })
      .filter(
        f => isJavaFlow(f)
      ).length > 0
  );
  const sectionsToHide = [!hasJavaFlows ? 'legacy' : ''];
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
                <Section
                  ssLinkedConnectionId={ssLinkedConnectionId}
                  integrationId={integrationId}
                />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanelWithLoad({ ssLinkedConnectionId, integrationId }) {
  const {hasSettingsMetadata} = useLoadSuiteScriptSettings({ssLinkedConnectionId, integrationId});

  return (
    <LoadSuiteScriptResources
      required
      ssLinkedConnectionId={ssLinkedConnectionId}
      integrationId={integrationId}
      resources="flows">
      {hasSettingsMetadata &&

      <AdminPanel
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}

 />}
    </LoadSuiteScriptResources>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
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
import GeneralSection from './sections/General';
import CustomSettings from './sections/Settings';

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
    path: 'customsettings',
    label: 'Custom settings',
    Section: CustomSettings,
    id: 'settings',
  },
];

export default function SettingsPanel({
  integrationId,
  storeId,
  ...sectionProps
}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const hideGeneralTab = useSelector(
    state => !selectors.hasGeneralSettings(state, integrationId, storeId)
  );
  const filterTabs = [];

  if (hideGeneralTab) {
    filterTabs.push('general');
  }
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId));
  if (!isFrameWork2) {
    filterTabs.push('settings');
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
    if (availableSections.length === 0) {
      return null;
    }
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

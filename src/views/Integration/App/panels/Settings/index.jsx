import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Route,
  Switch,
  NavLink,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { isEqual } from 'lodash';
import * as selectors from '../../../../../reducers';
import GeneralSection from './sections/General';
import ConfigureSettings from './sections/ConfigureSettings';
import PanelHeader from '../../../../../components/PanelHeader';

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
  divider: {
    marginRight: theme.spacing(1),
    marginTop: '10px',
    marginBottom: '10px',
  },
}));

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
  const flowSections = useSelector(state => {
    const sections = selectors.integrationAppFlowSections(state, integrationId, storeId);
    return sections.reduce((newArray, s) => {
      if (!!s.fields || !!s.sections) {
        newArray.push({
          path: s.titleId,
          label: s.title,
          Section: 'FlowsConfiguration',
          id: s.titleId
        });
      }
      return newArray;
    }, []);
  }, isEqual);

  const allSections = useMemo(() => ([
    {
      path: 'common',
      label: 'General',
      Section: GeneralSection,
      id: 'common',
    },
    ...flowSections
  ]), [flowSections]);

  const filterTabs = [];

  if (hideGeneralTab) {
    filterTabs.push('general');
  }

  const availableSections = useMemo(() => allSections.filter(sec =>
    !filterTabs.includes(sec.id)
  ), [allSections, filterTabs]);

  // if someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because some users have different sets of available
  // sections.
  if (match.isExact) {
    // no section provided.
    if (availableSections.length === 0) {
      return (
        <div className={classes.root}>
          <div className={classes.container}>
            <Typography variant="h4">
              Settings
            </Typography>
          </div>
          <Divider className={classes.divider} />
          <div className={classes.content}>
            <span>
              You don&apos;t have any custom settings for this integration.
            </span>
          </div>
        </div>);
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
            {availableSections.map(({ path, Section, label }) => (
              <Route key={path} path={`${match.url}/${path}`}>
                {Section === 'FlowsConfiguration' ? (
                  <>
                    <PanelHeader title={`Configure all ${label} flows`} />
                    <ConfigureSettings
                      integrationId={integrationId}
                      storeId={storeId}
                      sectionId={path}
                      parentUrl={match.url}
                      />
                  </>) : <Section
                    integrationId={integrationId}
                    storeId={storeId}
                    {...sectionProps}
                />}

              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  );
}

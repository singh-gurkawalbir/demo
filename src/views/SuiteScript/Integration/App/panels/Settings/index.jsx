import { Divider, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { isEqual } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  NavLink,

  Redirect, Route,
  Switch,

  useRouteMatch
} from 'react-router-dom';
import PanelHeader from '../../../../../../components/PanelHeader';
import Spinner from '../../../../../../components/Spinner';
import * as selectors from '../../../../../../reducers';
import { useLoadSuiteScriptSettings } from '../../../DIY/panels/Admin';
import ConfigureSettings from './sections/ConfigureSettings';


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

function SettingsPanelComponent({
  integrationId,
  ssLinkedConnectionId,
  ...sectionProps
}) {
  const classes = useStyles();
  const match = useRouteMatch();


  const availableSections = useSelector(state => {
    const sections = selectors.suiteScriptIASections(state, integrationId, ssLinkedConnectionId);
    return sections.reduce((newArray, s) => {
      if (!!s.fields || !!s.sections?.length) {
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
            {availableSections.map(({ path, Section, label, id }) => (
              <Route key={path} path={`${match.url}/${path}`}>
                {Section === 'FlowsConfiguration' ? (
                  <>
                    <PanelHeader title={`Configure all ${label} flows`} />
                    <ConfigureSettings
                      integrationId={integrationId}
                      ssLinkedConnectionId={ssLinkedConnectionId}
                      sectionId={path}
                      id={id}
                      />
                  </>) : <Section
                    integrationId={integrationId}
                    ssLinkedConnectionId={ssLinkedConnectionId}
                    sectionId={path}
                    id={id}
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

export default function SettingsPanel({ ssLinkedConnectionId, integrationId }) {
  const classes = useStyles();

  const infoTextFlow =
      'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  const {hasSettingsMetadata} = useLoadSuiteScriptSettings({ssLinkedConnectionId, integrationId});
  return (
    <div className={classes.root}>
      <PanelHeader title="Integration flows" infoText={infoTextFlow} />

      {hasSettingsMetadata ?
        <SettingsPanelComponent
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}

          /> : <Spinner />}

    </div>
  );
}

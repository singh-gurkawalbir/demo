import { Grid, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, Redirect, Route, useRouteMatch } from 'react-router-dom';
import CeligoTable from '../../../../../../components/CeligoTable';
import SettingsIcon from '../../../../../../components/icons/SettingsIcon';
import IconTextButton from '../../../../../../components/IconTextButton';
import PanelHeader from '../../../../../../components/PanelHeader';
import metadata from '../../../../../../components/ResourceTable/metadata/suiteScript/flows';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import * as selectors from '../../../../../../reducers';
import ScheduleDrawer from '../../../../../FlowBuilder/drawers/Schedule';
import ConfigureDrawer from './ConfigureDrawer';
import {useLoadSuiteScriptSettings} from '../Admin';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 0, 3, 0),
    overflowX: 'scroll',
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
  configureSectionBtn: {
    padding: 0,
  },
}));

function FlowList({ integrationId, ssLinkedConnectionId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const { fields, flows, sections } = useSelector(state =>
    selectors.suiteScriptFlowSettings(
      state,
      integrationId,
      ssLinkedConnectionId,
      sectionId,
    )
  );

  const hasAdvancedSettings = !!fields || !!sections;
  const flowSections = useSelector(state =>
    selectors.suiteScriptFlowSections(state, integrationId, ssLinkedConnectionId)
  );
  const section = flowSections.find(s => s.titleId === sectionId);
  const filterKey = `${integrationId}-flows`;

  return (
    <>
      <ScheduleDrawer />
      <ConfigureDrawer
        integrationId={integrationId}
        ssLinkedConnectionId={ssLinkedConnectionId}
        sectionId={sectionId}
      />


      <PanelHeader title={`${section.title} flows`}>
        {hasAdvancedSettings && (
          <IconTextButton
            variant="text"
            color="primary"
            data-test={`configure${section.title}`}
            component={Link}
            className={classes.configureSectionBtn}
            to={`${sectionId}/configure`}>
            <SettingsIcon /> Configure {section.title}
          </IconTextButton>
        )}
      </PanelHeader>
      <CeligoTable
        data={flows}
        filterKey={filterKey}
        {...metadata}
        actionProps={{ ssLinkedConnectionId, integrationId }}
        />
    </>
  );
}

function FlowPanel({ integrationId, ssLinkedConnectionId }) {
  const match = useRouteMatch();
  const classes = useStyles();

  const flowSections = useSelector(state =>
    selectors.suiteScriptFlowSections(state, integrationId, ssLinkedConnectionId)
  );

  // If someone arrives at this view without requesting a section, then we
  // handle this by redirecting them to the first available section. We can
  // not hard-code this because different sections exist across IAs.
  if (match.isExact && flowSections && flowSections.length) {
    return (
      <Redirect push={false} to={`${match.url}/${flowSections[0].titleId}`} />
    );
  }

  return (
    <div className={classes.root}>
      <Grid container wrap="nowrap">
        <Grid item className={classes.subNav}>
          <List>
            {flowSections.map(({ title, titleId }) => (
              <ListItem key={titleId}>
                <NavLink
                  className={classes.listItem}
                  activeClassName={classes.activeListItem}
                  to={titleId}
                  data-test={titleId}>
                  {title}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item className={classes.content}>
          <Route path={`${match.url}/:sectionId`}>
            <FlowList integrationId={integrationId} ssLinkedConnectionId={ssLinkedConnectionId} />
          </Route>
        </Grid>
      </Grid>
    </div>
  );
}


export default function FlowsPanel({ ssLinkedConnectionId, integrationId }) {
  const classes = useStyles();

  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  const {hasSettingsMetadata} = useLoadSuiteScriptSettings({ssLinkedConnectionId, integrationId});
  return (
    <div className={classes.root}>
      <ScheduleDrawer ssLinkedConnectionId={ssLinkedConnectionId} />
      <PanelHeader title="Integration flows" infoText={infoTextFlow} />
      <LoadSuiteScriptResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        resources="flows">
        {hasSettingsMetadata &&
        <FlowPanel
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}

        />}

      </LoadSuiteScriptResources>
    </div>
  );
}

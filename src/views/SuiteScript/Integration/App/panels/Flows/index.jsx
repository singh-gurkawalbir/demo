import { Grid, List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Redirect, Route, useRouteMatch } from 'react-router-dom';
import CeligoTable from '../../../../../../components/CeligoTable';
import PanelHeader from '../../../../../../components/PanelHeader';
import metadata from '../../../../../../components/ResourceTable/metadata/suiteScript/flows';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import * as selectors from '../../../../../../reducers';
import ScheduleDrawer from '../../../../../FlowBuilder/drawers/Schedule';
import { useLoadSuiteScriptSettings } from '../../../DIY/panels/Admin';
import Spinner from '../../../../../../components/Spinner';

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

function FlowList({ ssLinkedConnectionId, integrationId }) {
  const match = useRouteMatch();
  const { sectionId } = match.params;
  const { flows } = useSelector(state =>
    selectors.suiteScriptFlowSettings(
      state,
      integrationId,
      ssLinkedConnectionId,
      sectionId,
    )
  );

  const flowSections = useSelector(state =>
    selectors.suiteScriptIAFlowSections(state, integrationId, ssLinkedConnectionId)
  );
  const section = flowSections.find(s => s.titleId === sectionId);
  const filterKey = `${integrationId}-flows`;

  return (
    <>
      <ScheduleDrawer />
      <PanelHeader title={`${section.title} flows`} />
      <CeligoTable
        data={flows}
        filterKey={filterKey}
        {...metadata}
        actionProps={{ ssLinkedConnectionId, integrationId, isConnector: true }}
        />
    </>
  );
}

function FlowPanel({ integrationId, ssLinkedConnectionId }) {
  const match = useRouteMatch();
  const classes = useStyles();

  const flowSections = useSelector(state =>
    selectors.suiteScriptIAFlowSections(state, integrationId, ssLinkedConnectionId)
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
        {hasSettingsMetadata ?
          <FlowPanel
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}

        /> : <Spinner />}

      </LoadSuiteScriptResources>
    </div>
  );
}

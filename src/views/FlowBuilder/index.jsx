
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ConfigConnectionDebugger from '../../components/drawer/ConfigConnectionDebugger';
import { selectors } from '../../reducers';
import ResourceDrawer from '../../components/drawer/Resource';
import { selectors } from '../../reducers';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../components/LoadResources';
import MappingDrawerRoute from '../MappingDrawer';
import BottomDrawer from './drawers/BottomDrawer';
import ErrorDetailsDrawer from './drawers/ErrorsDetails';
import HooksDrawer from './drawers/Hooks';
import ChartsDrawer from './drawers/LineGraph';
import ReplaceConnectionDrawer from './drawers/ReplaceConnection';
import ScheduleDrawer from './drawers/Schedule';
import SettingsDrawer from './drawers/Settings';
import EditorDrawer from '../../components/AFE/Drawer';
import loadable from '../../utils/loadable';
import retry from '../../utils/retry';
import Spinner from '../../components/Spinner';
import actions from '../../actions';

const FlowBuilderBody = loadable(() =>
  retry(() => import(/* webpackChunkName: 'FlowBuilderBody' */ './FlowBuilderBody'))
);
const Redirection = loadable(() =>
  retry(() => import(/* webpackChunkName: 'FlowBuilderRedirection' */ './Redirection'))
);

function FBComponent({flowId, integrationId, childId}) {
  return (
    <>
      <FlowBuilderBody
        flowId={flowId}
        integrationId={integrationId}
      />

      <BottomDrawer
        flowId={flowId}
        integrationId={integrationId}
        childId={childId}
      />
    </>
  );
}
export default function FlowBuilder() {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { flowId, integrationId, childId } = match.params;
  const dependenciesResolved = useSelector(state => selectors.resolvedIntegrationDependencies(state, integrationId));

  useEffect(() => {
    dispatch(actions.resource.integrations.fetchIfAnyUnloadedFlows(integrationId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dependenciesResolved) {
    return <Spinner centerAll loading size="large" />;
  }

  // Initializes a new flow (patch, no commit)
  // and replaces the url to reflect the new temp flow id.

  // #endregion

  return (
    <LoadResources required resources="imports, exports, flows, scripts">
      <Redirection>
        <ResourceDrawer flowId={flowId} integrationId={integrationId} />
        <ConfigConnectionDebugger />
        <HooksDrawer flowId={flowId} integrationId={integrationId} />
        <ScheduleDrawer flowId={flowId} />
        <ChartsDrawer flowId={flowId} />
        <QueuedJobsDrawer />
        <EditorDrawer />
        <ErrorDetailsDrawer flowId={flowId} />
        <SettingsDrawer
          dataPublic
          integrationId={integrationId}
          resourceType="flows"
          resourceId={flowId}
          flowId={flowId} />
        <ReplaceConnectionDrawer
          flowId={flowId}
          integrationId={integrationId}
          childId={childId} />

        <FBComponent flowId={flowId} integrationId={integrationId} childId={childId} />
        <MappingDrawerRoute integrationId={integrationId} />
      </Redirection>
    </LoadResources>
  );
}

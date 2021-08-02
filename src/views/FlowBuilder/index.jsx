
import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ConfigConnectionDebugger from '../../components/drawer/ConfigConnectionDebugger';
import ResourceDrawer from '../../components/drawer/Resource';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../components/LoadResources';
import ResponseMappingDrawer from '../../components/ResponseMapping/Drawer';
import MappingDrawerRoute from '../MappingDrawer';
import BottomDrawer from './drawers/BottomDrawer';
import ErrorDetailsDrawer from './drawers/ErrorsDetails';
import HooksDrawer from './drawers/Hooks';
import ChartsDrawer from './drawers/LineGraph';
import ReplaceConnectionDrawer from './drawers/ReplaceConnection';
import ScheduleDrawer from './drawers/Schedule';
import SettingsDrawer from './drawers/Settings';
import EditorDrawer from '../../components/AFE/Drawer';
import FlowBuilderBody from './FlowBuilderBody';
import Redirection from './Redirection';

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

  const { flowId, integrationId, childId } = match.params;

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
        <ResponseMappingDrawer integrationId={integrationId} />
      </Redirection>
    </LoadResources>
  );
}


import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import ResourceDrawer from '../../components/drawer/Resource';
import QueuedJobsDrawer from '../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../components/LoadResources';
import MappingDrawerRoute from '../MappingDrawer';
import BottomDrawer from './drawers/BottomDrawer';
import ErrorDetailsDrawer from './drawers/ErrorsDetails';
import ChartsDrawer from './drawers/LineGraph';
import ScheduleDrawer from './drawers/Schedule';
import SettingsDrawer from './drawers/Settings';
import FlowBuilderBody from './FlowBuilderBody';
import Redirection from './Redirection';

function FBComponent({flowId, integrationId}) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <FlowBuilderBody
        flowId={flowId}
        integrationId={integrationId}
        setTabValue={setTabValue}
   />

      <BottomDrawer
        flowId={flowId}
        tabValue={tabValue}
        setTabValue={setTabValue}
/>
    </>
  );
}
function FlowBuilder() {
  const match = useRouteMatch();

  const { flowId, integrationId } = match.params;

  // Initializes a new flow (patch, no commit)
  // and replaces the url to reflect the new temp flow id.

  // #endregion

  return (
    <LoadResources required resources="imports, exports, flows">
      <Redirection>
        <ResourceDrawer
          flowId={flowId}
          integrationId={integrationId}
      />

        <ScheduleDrawer flowId={flowId} />
        <ChartsDrawer flowId={flowId} />
        <SettingsDrawer
          integrationId={integrationId}
          resourceType="flows"
          resourceId={flowId}
          flowId={flowId}
      />
        <QueuedJobsDrawer />

        <ErrorDetailsDrawer flowId={flowId} />

        <FBComponent flowId={flowId} integrationId={integrationId} />
        <MappingDrawerRoute
          integrationId={integrationId}
      />
      </Redirection>
    </LoadResources>
  );
}

export default FlowBuilder;

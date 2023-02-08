import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import IntegrationTabs from './IntegrationTabs';
import ResourceDrawer from '../../../components/drawer/Resource';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../../components/LoadResources';
import PageBar from './PageBar';
import TabRedirection from './TabRedirection';
import EditorDrawer from '../../../components/AFE/Drawer';

export default function IntegrationDIY({integrationId}) {
  const match = useRouteMatch();
  const { childId } = match.params;

  console.log('11111', childId);

  return (
    <>
      <ResourceDrawer />
      <QueuedJobsDrawer integrationId={integrationId} />
      <LoadResources required integrationId={childId} resources="published,flows,connections,marketplacetemplates">
        <TabRedirection>
          <PageBar />
          <IntegrationTabs />
        </TabRedirection>
      </LoadResources>
      <EditorDrawer />
    </>
  );
}

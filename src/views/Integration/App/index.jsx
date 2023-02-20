import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ResourceDrawer from '../../../components/drawer/Resource';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResource from '../../../components/LoadResource';
import IntegrationTabs from './IntegrationTabs';
import PageBar from './PageBar';
import TabRedirection from './TabRedirection';

export default function IntegrationApp() {
  const match = useRouteMatch();
  const {integrationId } = match.params;

  return (
    <LoadResource resourceId={integrationId} resourceType="integrations">
      <TabRedirection >
        <PageBar />
        <IntegrationTabs />
        <ResourceDrawer />
        <QueuedJobsDrawer integrationId={integrationId} />
      </TabRedirection>
    </LoadResource>
  );
}

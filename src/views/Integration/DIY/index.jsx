import React from 'react';
import IntegrationTabs from './IntegrationTabs';
import ResourceDrawer from '../../../components/drawer/Resource';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../../components/LoadResources';
import PageBar from './PageBar';
import TabRedirection from './TabRedirection';
import EditorDrawer from '../../../components/AFE/Drawer';

export default function IntegrationDIY() {
  return (
    <>
      <ResourceDrawer />
      <QueuedJobsDrawer />
      <LoadResources required resources="integrations,marketplacetemplates">
        <TabRedirection>
          <PageBar />
          <IntegrationTabs />
        </TabRedirection>
      </LoadResources>
      <EditorDrawer />
    </>
  );
}

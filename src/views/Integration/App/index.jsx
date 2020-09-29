import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import ResourceDrawer from '../../../components/drawer/Resource';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import LoadResources from '../../../components/LoadResources';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import IntegrationTabs from './IntegrationTabs';
import PageBar from './PageBar';
import TabRedirection from './TabRedirection';

export default function IntegrationApp() {
  const match = useRouteMatch();
  const {integrationId } = match.params;
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  // There is no need for further processing if no integration
  // is returned. Most likely case is that there is a pending IO
  // call for integrations.
  if (!integration || !integration._id) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <>
      <TabRedirection />
      <PageBar />
      <IntegrationTabs />
      <ResourceDrawer />
      <QueuedJobsDrawer />
    </>
  );
}

import getRoutePath from '../../../../utils/routePaths';
import IntegrationCrumb from './crumbs/Integration';
import EditResourceTypeCrumb from './crumbs/EditResourceType';

export const integrationRoutes = [
  {
    path: '/admin',
    breadcrumb: () => 'Admin',
    childRoutes: [
      { path: '/general', breadcrumb: () => 'General' },
      { path: '/legacy', breadcrumb: () => 'Legacy' },
    ],
  },
  { path: '/flows', breadcrumb: () => 'Flows' },
  { path: '/dashboard', breadcrumb: () => 'Dashboard' },
  { path: '/connections', breadcrumb: () => 'Connections' },
  {
    path: '/flowBuilder/:flowId',
    breadcrumb: () => 'Flow builder',
    childRoutes: [
      { path: '/schedule', breadcrumb: () => 'Schedule' },
      { path: '/settings', breadcrumb: () => 'Settings' },
      {
        path: '/edit/:resourceType/:id',
        breadcrumb: EditResourceTypeCrumb,
      },
    ],
  },
];

export default [
  {
    path: getRoutePath('/suitescript/:ssLinkedConnectionId/integrations/:integrationId'),
    breadcrumb: IntegrationCrumb,
    childRoutes: integrationRoutes,
  },
  {
    path: getRoutePath('/suitescript/:ssLinkedConnectionId/integrationapps/:integrationAppName/:integrationId'),
    breadcrumb: IntegrationCrumb,
    childRoutes: integrationRoutes,
  }
];

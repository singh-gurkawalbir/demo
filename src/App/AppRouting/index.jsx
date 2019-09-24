import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';
import SignIn from '../../views/SignIn';
import IntegrationSettings from '../../views/IntegrationSettings';
import IntegrationAppAddNewStore from '../../views/IntegrationApps/AddNewStore';
import IntegrationAppSettings from '../../views/IntegrationApps/Settings';
import IntegrationAppUninstallation from '../../views/IntegrationApps/Uninstaller';
import IntegrationAppInstallation from '../../views/IntegrationApps/Installer';
import TemplatePreview from '../../views/Templates/Preview';
import TemplateInstall from '../../views/Templates/Install';

const RecycleBin = loadable(() =>
  import(/* webpackChunkName: 'RecycleBin' */ '../../views/RecycleBin')
);
const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../../views/Dashboard')
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../../views/NotFound')
);
const Permissions = loadable(() =>
  import(/* webpackChunkName: 'Permissions' */ '../../views/Permissions')
);
const Resources = loadable(() =>
  import(/* webpackChunkName: 'Resources' */ '../../views/Resources')
);
const Editors = loadable(() =>
  import(/* webpackChunkName: 'Editors' */ '../../views/Editors')
);
const FlowBuilder = loadable(() =>
  import(/* webpackChunkName: 'FlowBuider' */ '../../views/FlowBuilder')
);
const ResourceList = loadable(() =>
  import(/* webpackChunkName: 'ResourceList' */ '../../views/ResourceList')
);
const Marketplace = loadable(() =>
  import(/* webpackChunkName: 'Marketplace' */ '../../views/MarketPlace')
);
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount')
);
const IntegrationDashboard = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationDashboard' */ '../../views/IntegrationDashboard'
  )
);
const ConnectorTemplateList = loadable(() =>
  import(
    /* webpackChunkName: 'ConnectorTemplateList' */ '../../components/MarketplaceList/ConnectorTemplateList'
  )
);
const templateRoutes = [
  {
    path: '/pg/marketplace/templates/:templateId/preview',
    component: TemplatePreview,
  },
  {
    path: '/pg/marketplace/templates/:templateId/setup',
    component: TemplateInstall,
  },
];
const integrationAppRoutes = [
  // TODO: should we change "connectors" to integrationapps? If we do, need to change all email templates which include "connectors"
  {
    path: '/pg/connectors/:integrationId/setup',
    component: IntegrationAppInstallation,
  },
  {
    path: '/pg/connectors/:integrationId/settings',
    component: IntegrationAppSettings,
  },
  {
    path: '/pg/connectors/:integrationId/install/addNewStore',
    component: IntegrationAppAddNewStore,
  },
  {
    path: [
      '/pg/connectors/:integrationId/uninstall/:storeId',
      '/pg/connectors/:integrationId/uninstall',
    ],
    component: IntegrationAppUninstallation,
  },
];

@hot(module)
export default class AppRouting extends Component {
  render() {
    return (
      <Switch>
        <Route
          path="/pg"
          exact
          render={({ history }) => history.replace('/pg/dashboard')}
        />
        <Route
          path="/pg/integrations/:integrationId/dashboard"
          component={IntegrationDashboard}
        />
        <Route
          path="/pg/integrations/:integrationId/settings"
          component={IntegrationSettings}
        />
        {templateRoutes.map(props => (
          <Route {...props} key={props.path} />
        ))}
        {integrationAppRoutes.map(props => (
          <Route {...props} key={props.path} />
        ))}
        <Route
          path="/pg/marketplace/:application"
          component={ConnectorTemplateList}
        />
        <Route path="/pg/dashboard" component={Dashboard} />
        <Route path="/pg/recycleBin" component={RecycleBin} />
        <Route path="/pg/signin" component={SignIn} />
        <Route path="/pg/flowBuilder" component={FlowBuilder} />
        <Route path="/pg/resources" component={Resources} />
        <Route path="/pg/editors" component={Editors} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route path="/pg/myAccount" component={MyAccount} />
        <Route path="/pg/marketplace" component={Marketplace} />
        <Route path="/pg/:resourceType" component={ResourceList} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

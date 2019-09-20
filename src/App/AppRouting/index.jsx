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
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount')
);
const IntegrationDashboard = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationDashboard' */ '../../views/IntegrationDashboard'
  )
);

@hot(module)
export default class AppRouting extends Component {
  render() {
    return (
      <Switch>
        <Route
          path="/pg/integrations/:integrationId/dashboard"
          component={IntegrationDashboard}
        />
        <Route
          path="/pg/integrations/:integrationId/settings"
          component={IntegrationSettings}
        />
        <Route
          path="/pg/connectors/:integrationId/setup"
          component={IntegrationAppInstallation}
        />
        <Route
          // TODO: should we change "connectors" to integrationapps? If we do, need to change all email templates which include "connectors"
          path="/pg/connectors/:integrationId/settings"
          component={IntegrationAppSettings}
        />
        <Route
          // TODO: should we change "connectors" to integrationapps? If we do, need to change all email templates which include "connectors"
          path="/pg/connectors/:integrationId/install/addNewStore"
          component={IntegrationAppAddNewStore}
        />
        <Route
          path={[
            // TODO: should we change "connectors" to integrationapps? If we do, need to change all email templates which include "connectors"
            '/pg/connectors/:integrationId/uninstall/:storeId',
            '/pg/connectors/:integrationId/uninstall',
          ]}
          component={IntegrationAppUninstallation}
        />
        <Route path="/pg/signin" component={SignIn} />
        <Route path="/pg/flowbuilder" component={FlowBuilder} />
        <Route path="/pg/resources" component={Resources} />
        <Route path={['/pg/edit', '/pg/add']} component={null} />
        <Route path="/pg/editors" component={Editors} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route path="/pg/myAccount" component={MyAccount} />
        <Route path="/pg/:resourceType" component={ResourceList} />
        <Route path="/pg" exact component={Dashboard} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

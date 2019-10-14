import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';
import SignIn from '../../views/SignIn';
import IntegrationSettings from '../../views/IntegrationSettings';
import IntegrationAppsRouter from '../../views/IntegrationApps/Router';
import MarketplaceRouter from '../../views/MarketPlace/Router';

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
  import(/* webpackChunkName: 'FlowBuilder' */ '../../views/FlowBuilder')
);
const ResourceList = loadable(() =>
  import(/* webpackChunkName: 'ResourceList' */ '../../views/ResourceList')
);
const TemplateList = loadable(() =>
  import(/* webpackChunkName: 'Marketplace' */ '../../views/TemplateList')
);
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount')
);
const IntegrationDashboard = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationDashboard' */ '../../views/IntegrationDashboard'
  )
);
const AccessTokenList = loadable(() =>
  import(
    /* webpackChunkName: 'AccessTokensList' */ '../../views/AccessTokenList'
  )
);
const ConnectorInstallBase = loadable(() =>
  import(
    /* webpackChunkName: 'InstallBase' */ '../../views/Connector/InstallBase'
  )
);
const ConnectorLicenses = loadable(() =>
  import(/* webpackChunkName: 'Licenses' */ '../../views/Connector/Licenses')
);

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
        <Route
          path="/pg/connectors/:connectorId/connectorLicenses"
          component={ConnectorLicenses}
        />
        <Route
          path="/pg/connectors/:connectorId/installBase"
          component={ConnectorInstallBase}
        />
        <Route path="/pg/connectors" component={IntegrationAppsRouter} />
        <Route path="/pg/marketplace" component={MarketplaceRouter} />
        <Route path="/pg/dashboard" component={Dashboard} />
        <Route path="/pg/recycleBin" component={RecycleBin} />
        <Route path="/pg/signin" component={SignIn} />
        <Route
          path={['/pg/flowBuilder/:flowId', '/pg/flowBuilder']}
          component={FlowBuilder}
        />
        <Route path="/pg/resources" component={Resources} />
        <Route path="/pg/editors" component={Editors} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route path="/pg/myAccount" component={MyAccount} />
        <Route path="/pg/templates" component={TemplateList} />
        <Route path="/pg/accesstokens" component={AccessTokenList} />
        <Route path="/pg/:resourceType" component={ResourceList} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

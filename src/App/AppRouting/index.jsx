import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';
import SignIn from '../../views/SignIn';

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
const Exports = loadable(() =>
  import(/* webpackChunkName: 'Exports' */ '../../views/Exports')
);
const StandaloneResource = loadable(() =>
  import(
    /* webpackChunkName: 'StandaloneResource' */ '../../views/StandaloneResource'
  )
);
const ResourceList = loadable(() =>
  import(
    /* webpackChunkName: 'StandaloneResource' */ '../../views/ResourceList'
  )
);
const Imports = loadable(() =>
  import(/* webpackChunkName: 'Imports' */ '../../views/Imports')
);
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount')
);
const IntegrationDashboard = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationDashboard' */ '../../views/IntegrationDashboard'
  )
);
/* webpackChunkName: 'IntegrationSettings' */
const IntegrationSettings = loadable(() =>
  import('../../views/IntegrationSettings')
);
const AccessTokens = loadable(() =>
  import(/* webpackChunkName: 'AccessTokens' */ '../../views/AccessTokens')
);
const Stacks = loadable(() =>
  import(/* webpackChunkName: 'Stacks' */ '../../views/Stacks')
);
const Connections = loadable(() =>
  import(/* webpackChunkName: 'Connections' */ '../../views/Connections')
);
const Scripts = loadable(() =>
  import(/* webpackChunkName: 'Scripts' */ '../../views/Scripts')
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
        <Route exact path="/pg/signin" component={SignIn} />
        <Route path="/pg/resources" component={Resources} />
        <Route path="/pg/editors" component={Editors} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route
          path="/pg/:resourceType/:operation/:id"
          component={StandaloneResource}
        />
        <Route path="/pg/:resourceType" component={ResourceList} />
        <Route path="/pg/exports" component={Exports} />
        <Route path="/pg/imports" component={Imports} />
        <Route path="/pg/myAccount" component={MyAccount} />
        <Route path="/pg/tokens" component={AccessTokens} />
        <Route path="/pg/stacks" component={Stacks} />
        <Route path="/pg/connections" component={Connections} />
        <Route path="/pg/scripts" component={Scripts} />
        <Route path="/pg" component={Dashboard} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

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
const CustomForms = loadable(() =>
  import(/* webpackChunkName: 'CustomForms' */ '../../views/CustomForms')
);
const Exports = loadable(() =>
  import(/* webpackChunkName: 'Exports' */ '../../views/Exports')
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
const IntegrationSettings = loadable(() =>
  import(
    /* webpackChunkName: 'IntegrationSettings' */ '../../views/IntegrationSettings'
  )
);
const AccessTokens = loadable(() =>
  import(/* webpackChunkName: 'AccessTokens' */ '../../views/AccessTokens')
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
        <Route path="/pg/forms" component={CustomForms} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route path="/pg/exports" component={Exports} />
        <Route path="/pg/imports" component={Imports} />
        <Route path="/pg/myAccount" component={MyAccount} />
        <Route path="/pg/tokens" component={AccessTokens} />
        <Route path="/pg" component={Dashboard} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

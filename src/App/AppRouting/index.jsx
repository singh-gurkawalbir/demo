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
const ResourceList = loadable(() =>
  import(
    /* webpackChunkName: 'StandaloneResource' */ '../../views/ResourceList'
  )
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
        <Route path={['/pg/edit', '/pg/add']} component={null} />
        <Route path="/pg/editors" component={Editors} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route path="/pg/myAccount" component={MyAccount} />
        <Route path="/pg" exact component={Dashboard} />
        <Route path="/pg/:resourceType" component={ResourceList} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import loadable from '../../utils/loadable';
import SignIn from '../../views/SignIn';
import { isSessionExpired, isAuthenticated } from '../../reducers';

const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../../views/Dashboard')
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../../views/NotFound')
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
const Imports = loadable(() =>
  import(/* webpackChunkName: 'Imports' */ '../../views/Imports')
);
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount')
);
const mapStateToProps = state => ({
  isAuthenticated: isAuthenticated(state),
  isSessionExpired: isSessionExpired(state),
});

@hot(module)
class AppRouting extends Component {
  render() {
    const { isAuthenticated, isSessionExpired } = this.props;

    return (
      <Switch>
        <Route exact path="/pg/signin" component={SignIn} />

        <PrivateRoute
          path="/pg/resources"
          component={Resources}
          isAuthenticated={isAuthenticated}
          isSessionExpired={isSessionExpired}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/pg/editors"
          component={Editors}
          isSessionExpired={isSessionExpired}
        />

        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/pg/exports"
          component={Exports}
          isSessionExpired={isSessionExpired}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/pg/imports"
          component={Imports}
          isSessionExpired={isSessionExpired}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/pg/myAccount"
          component={MyAccount}
          isSessionExpired={isSessionExpired}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/pg"
          component={Dashboard}
          isSessionExpired={isSessionExpired}
        />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(AppRouting)
);

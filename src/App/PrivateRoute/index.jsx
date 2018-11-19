import { Redirect, Route } from 'react-router-dom';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
// import { isProfileLoading } from '../../reducers';

@hot(module)
export default class PrivateRoute extends Component {
  /**
   * Make some dummy call to retrieve profile check to see you get a 200 level
   * response
   *
   */

  render() {
    const { component: Component, authenticated, rest } = this.props;

    this.props.location.state;

    return (
      <Route
        {...rest}
        render={props =>
          authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/pg/signin',
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

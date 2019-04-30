import { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router-dom';
import AppRouting from '../AppRouting';
import * as selectors from '../../reducers';
import actions from '../../actions';

const mapStateToProps = state => ({
  showAppRoutingWithAuth: selectors.showAppRoutingWithAuth(state),
});
const mapDispatchToProps = dispatch => ({
  initSession: () => {
    dispatch(actions.auth.initSession());
  },
});

@hot(module)
class AppRoutingWithAuth extends Component {
  componentWillMount() {
    const { initSession, isAuthInitialized } = this.props;

    if (!isAuthInitialized) initSession();
  }
  render() {
    // this selector is used by the UI to hold off rendering any routes
    // till it determines the auth state
    const { showAppRoutingWithAuth } = this.props;

    if (!showAppRoutingWithAuth) return null;

    return <AppRouting />;
  }
}

// we need to create a HOC with withRouter otherwise the router context will
// go missing when using connect and this can result in the Path component not
// being able to make matches to the url provided
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppRoutingWithAuth)
);

import { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router-dom';
import AppRouting from '../AppRouting';
import * as selectors from '../../reducers';
import actions from '../../actions';
// import getRoutePath from '../../utils/routePaths';

const mapStateToProps = state => ({
  attemptedUrl: selectors.authFailureAttemptedUrl(state),
  shouldShowAppRouting: selectors.shouldShowAppRouting(state),
  isAuthInitialized: selectors.isAuthInitialized(state),
});
const mapDispatchToProps = dispatch => ({
  initSession: attemptedUrl => {
    dispatch(actions.auth.initSession(attemptedUrl));
  },
  clearAttemptedUrl: () => {
    dispatch(actions.auth.clearAttemptedUrl());
  },
});

@hot(module)
class AppRoutingWithAuth extends Component {
  componentWillMount() {
    const { initSession, isAuthInitialized, location } = this.props;

    if (!isAuthInitialized) initSession(location.pathname);
  }

  render() {
    const { shouldShowAppRouting } = this.props;
    // this selector is used by the UI to hold off rendering any routes
    // till it determines the auth state

    return shouldShowAppRouting && <AppRouting />;
  }

  componentDidUpdate() {
    const { location, attemptedUrl, clearAttemptedUrl } = this.props;
    const redirectedFrom = location && location.referer;

    // if i am redirected from the signin page and
    // redirectTed to the attempted Url
    // I can go ahead and clear the attempted url

    // Cannot update during an existing state transition
    // (such as within `render`). Render methods should be a
    // pure function of props and state.
    if (location.pathname === attemptedUrl && redirectedFrom === '/pg/signin') {
      clearAttemptedUrl();
    }
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

import { Component } from 'react';
import { connect } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRequestOptions from '../../utils/requestOptions';
import { COMM_STATES } from '../../reducers/comms';

const mapStateToProps = (state, { actionsToMonitor = {} }) => {
  const toMonitor = {};

  Object.keys(actionsToMonitor).forEach(actionName => {
    const action = actionsToMonitor[actionName];
    const { path, opts } = getRequestOptions(action.action, {
      resourceId: action.resourceId,
    });

    toMonitor[actionName] = selectors.commStatusByPath(
      state,
      path,
      opts.method
    );
  });

  return {
    toMonitor,
  };
};

const mapDispatchToProps = dispatch => ({
  clearCommByPath: path => {
    dispatch(actions.clearCommByPath(path));
  },
});

class CommStatus extends Component {
  componentWillReceiveProps(nextProps) {
    const {
      actionsToMonitor,
      autoClearOnComplete,
      actionsToClear,
      clearCommByPath,
      toMonitor,
      commStatusHandler,
    } = nextProps;

    commStatusHandler(toMonitor);

    let action;

    if (autoClearOnComplete) {
      Object.keys(toMonitor).forEach(actionKey => {
        action = actionsToMonitor[actionKey];

        if (
          toMonitor[actionKey] &&
          [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(
            toMonitor[actionKey].status
          )
        ) {
          const { path } = getRequestOptions(action.action, {
            resourceId: action.resourceId,
          });

          clearCommByPath(path);
        }
      });
    } else if (actionsToClear && actionsToClear.length) {
      actionsToClear.forEach(actionKey => {
        action = actionsToMonitor[actionKey];

        if (toMonitor && toMonitor[actionKey]) {
          const { path } = getRequestOptions(action.action, {
            resourceId: action.resourceId,
          });

          clearCommByPath(path);
        }
      });
    }
  }
  render() {
    return null;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommStatus);

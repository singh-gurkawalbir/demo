import { Component } from 'react';
import { connect } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRequestOptions from '../../utils/requestOptions';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import commKeyGenerator from '../../utils/commKeyGenerator';

const emptyObj = {};
const mapStateToProps = (state, { actionsToMonitor }) => {
  if (!actionsToMonitor || Object.keys(actionsToMonitor).length === 0) {
    return { toMonitor: emptyObj };
  }

  const toMonitor = {};

  Object.keys(actionsToMonitor).forEach(actionName => {
    const action = actionsToMonitor[actionName];
    const { path, opts } = getRequestOptions(action.action, {
      resourceId: action.resourceId,
      integrationId: action.integrationId,
    });

    toMonitor[actionName] = selectors.commStatusByKey(
      state,
      commKeyGenerator(path, opts.method)
    );
  });

  Object.keys(toMonitor).forEach(actionName => {
    if (toMonitor[actionName] && toMonitor[actionName].message) {
      if (
        Object.prototype.toString.apply(toMonitor[actionName].message) ===
        '[object String]'
      ) {
        try {
          toMonitor[actionName].message = JSON.parse(
            toMonitor[actionName].message
          );
        } catch (ex) {
          // do nothing
        }
      }

      if (
        Object.prototype.toString.apply(toMonitor[actionName].message) ===
        '[object Object]'
      ) {
        toMonitor[actionName].message =
          toMonitor[actionName].message.errors[0].message;
      }
    }
  });

  return {
    toMonitor,
  };
};

const mapDispatchToProps = dispatch => ({
  clearCommByKey: key => {
    dispatch(actions.clearCommByKey(key));
  },
});

class CommStatus extends Component {
  componentWillReceiveProps(nextProps) {
    const {
      actionsToMonitor,
      autoClearOnComplete,
      actionsToClear,
      clearCommByKey,
      toMonitor,
      commStatusHandler,
    } = nextProps;

    if (JSON.stringify(toMonitor) !== '{}') commStatusHandler(toMonitor);

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
          const { path, opts } = getRequestOptions(action.action, {
            resourceId: action.resourceId,
          });

          clearCommByKey(commKeyGenerator(path, opts.method));
        }
      });
    } else if (actionsToClear && actionsToClear.length) {
      actionsToClear.forEach(actionKey => {
        action = actionsToMonitor[actionKey];

        if (toMonitor && toMonitor[actionKey]) {
          const { path, opts } = getRequestOptions(action.action, {
            resourceId: action.resourceId,
          });

          clearCommByKey(commKeyGenerator(path, opts.method));
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

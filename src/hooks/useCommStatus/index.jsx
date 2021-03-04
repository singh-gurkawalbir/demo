import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import useSelectorMemo from '../selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { COMM_STATES } from '../../reducers/comms/networkComms';
import commKeyGenerator from '../../utils/commKeyGenerator';
import getRequestOptions from '../../utils/requestOptions';

export default function useCommStatus({actionsToMonitor, commStatusHandler, autoClearOnComplete, actionsToClear}) {
  const dispatch = useDispatch();
  const clearCommByKey = useCallback(key => dispatch(actions.clearCommByKey(key)), [dispatch]);

  const toMonitor = useSelectorMemo(selectors.mkActionsToMonitorCommStatus, actionsToMonitor);

  useEffect(() => {
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
  }, [actionsToClear, actionsToMonitor, autoClearOnComplete, clearCommByKey, commStatusHandler, toMonitor]);

  return null;
}

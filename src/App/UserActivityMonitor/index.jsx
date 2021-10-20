import { useCallback, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector} from 'react-redux';
import actions from '../../actions';
import {selectors} from '../../reducers';
import { POLLING_STATUS } from '../../utils/constants';

/*
  The way this component works is it tracks the user activity and as soon it notices that the user is idle for about the complete inactive period it stops all polling process.
  It also has a slowdown feature in which during the SLOW_DOWN_PERIOD prior to the completion of the user inactive period, it reduces the polling frequency by a half.

*/

export default function UserActivityMonitor() {
  const dispatch = useDispatch();

  const handleOnIdle = useCallback(() => {
    dispatch(
      actions.app.polling.stop()
    );
  }, [dispatch]);

  const handleOnActive = useCallback(() => {
    dispatch(actions.app.polling.resume());
  }, [dispatch]);

  const { getRemainingTime } = useIdleTimer({
    timeout: Number(process.env.USER_INACTIVE_PERIOD),
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  const pollingStatus = useSelector(state => selectors.pollingStatus(state));

  useEffect(() => {
    let intervalID;

    // when polling resumes then we should and the idle time elapsed reaches the slow down threshold we should dispatch the slow down polling action
    if (!pollingStatus || pollingStatus === POLLING_STATUS.RESUME) {
      intervalID = setInterval(() => {
        // keep sampling the getRemainingTime to check if it is less than the slow down period.
        const shouldUpdateSlowPollingState = getRemainingTime() < Number(process.env.SLOW_DOWN_PERIOD);

        if (shouldUpdateSlowPollingState) {
          dispatch(actions.app.polling.slowDown());
        }
      }, 1000);
    }

    // once the polling status has been updated to slow we should clear the setInterval
    return () => {
      clearInterval(intervalID);
    };
  }, [dispatch, getRemainingTime, pollingStatus]);

  return null;
}

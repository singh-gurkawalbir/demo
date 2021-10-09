import { useCallback, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector} from 'react-redux';
import actions from '../../actions';
import {selectors} from '../../reducers';
import { POLLING_STATUS } from '../../reducers/app';

const USER_INACTIVE_PERIOD = 1000 * 60 * 1;

const SLOW_DOWN_PERIOD = 1000 * 60 * 0.5;
export default function UserActivityMonitor() {
  const dispatch = useDispatch();

  const handleOnIdle = useCallback(() => {
    console.error('idle ');

    dispatch(
      actions.app.polling.stop()
    );
  }, [dispatch]);

  const handleOnActive = useCallback(() => {
    console.error('active ');

    dispatch(actions.app.polling.resume());
  }, [dispatch]);
  const { getRemainingTime } = useIdleTimer({
    timeout: USER_INACTIVE_PERIOD,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500,
  });

  const pollingStatus = useSelector(state => selectors.pollingStatus(state));

  useEffect(() => {
    let intervalID;

    if (!pollingStatus || pollingStatus === POLLING_STATUS.RESUME) {
      intervalID = setInterval(() => {
        const shouldUpdateSlowPollingState = getRemainingTime() < SLOW_DOWN_PERIOD;

        if (shouldUpdateSlowPollingState) {
          dispatch(actions.app.polling.slowDown());
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalID);
    };
  }, [dispatch, getRemainingTime, pollingStatus]);

  return null;
}

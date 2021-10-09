import { useCallback, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector} from 'react-redux';
import actions from '../../actions';
import {selectors} from '../../reducers';
import { POLLING_STATUS } from '../../reducers/app';

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

    if (!pollingStatus || pollingStatus === POLLING_STATUS.RESUME) {
      intervalID = setInterval(() => {
        const shouldUpdateSlowPollingState = getRemainingTime() < Number(process.env.SLOW_DOWN_PERIOD);

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

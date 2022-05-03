
import { useCallback, useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const DEBOUNCE_DURATION = 1000 * 1;

const SESSION_DURATION_BEFORE_ALERT = Number(process.env.SESSION_EXPIRATION_INTERVAL) -
Number(process.env.SESSION_WARNING_INTERVAL_PRIOR_TO_EXPIRATION) -
// To prevent a race condition with the isSessionExpiredOrInWarning lets set the timeout 5 seconds prior to the alert
 1000 * 5;

const getTimeElapsedDuringSession = sessionValidTimestamp => Date.now() - sessionValidTimestamp;

export default function UserIdleTracker() {
  const sessionValidTimestamp = useSelector(state => selectors.sessionValidTimestamp(state));

  const isSessionExpiredOrInWarning = useSelector(state => !!selectors.showSessionStatus(state));

  const dispatch = useDispatch();
  const [isUserActive, setIsUserActive] = useState(false);

  const onActive = useCallback(() => {
    setIsUserActive(true);
  }, []);
  const {reset} = useIdleTimer({
    timeout: SESSION_DURATION_BEFORE_ALERT,
    throttle: DEBOUNCE_DURATION,
    onAction: onActive,
  });

  useEffect(() => {
    let timeoutId;

    if (isUserActive && !isSessionExpiredOrInWarning) {
      const remainingSessionDuration = SESSION_DURATION_BEFORE_ALERT -
      getTimeElapsedDuringSession(sessionValidTimestamp);

      // set timeout to refresh the session almost at the very end of the session window
      // do not refresh for every user update
      timeoutId = setTimeout(() => {
        dispatch(actions.user.profile.request('Refreshing session'));
        setIsUserActive(false);
      }, [remainingSessionDuration]);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserActive, isSessionExpiredOrInWarning]);
  useEffect(() => {
    reset();
    setIsUserActive(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionValidTimestamp]);

  return null;
}


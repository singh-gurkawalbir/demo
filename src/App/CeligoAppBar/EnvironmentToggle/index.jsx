import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TextToggle } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import getRoutePath from '../../../utils/routePaths';

function EnvironmentToggle({ handleToggle }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
  const { environment = 'production' } = useSelector(state =>
    selectors.userPreferences(state)
  );
  const selectedAccountHasSandbox = useSelector(state =>
    selectors.accountHasSandbox(state)
  );
  const handleChange = useCallback(
    (event, newValue) => {
      dispatch(actions.user.preferences.update({ environment: newValue }));
      if (handleToggle && typeof handleToggle === 'function') {
        handleToggle();
      } else {
        history.push(getRoutePath('/'));
      }
    },
    [dispatch, handleToggle, history]
  );

  if (isMFASetupIncomplete || !selectedAccountHasSandbox) return null;

  return (
    <TextToggle
      value={environment}
      onChange={handleChange}
      options={[
        { value: 'production', label: 'Production' },
        { value: 'sandbox', label: 'Sandbox' },
      ]}
    />
  );
}

export default function EnvironmentToggleMemo({ handleToggle }) {
  return useMemo(() => <EnvironmentToggle handleToggle={handleToggle} />, [handleToggle]);
}

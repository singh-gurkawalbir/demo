import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import TextToggle from '../../../components/TextToggle';
import getRoutePath from '../../../utils/routePaths';

function EnvironmentToggle() {
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
    environment => {
      dispatch(actions.user.preferences.update({ environment }));
      history.push(getRoutePath('/'));
    },
    [dispatch, history]
  );

  if (isMFASetupIncomplete || !selectedAccountHasSandbox) return null;

  return (
    <TextToggle
      value={environment}
      onChange={handleChange}
      exclusive
      options={[
        { value: 'production', label: 'Production' },
        { value: 'sandbox', label: 'Sandbox' },
      ]}
    />
  );
}
export default function EnvironmentToggleMemo() {
  return useMemo(() => <EnvironmentToggle />, []);
}

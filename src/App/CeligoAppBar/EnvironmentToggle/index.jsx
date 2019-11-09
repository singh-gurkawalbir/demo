import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import TextToggle from '../../../components/TextToggle';
import getRoutePath from '../../../utils/routePaths';

export default function EnvironmentToggle() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { environment = 'production' } = useSelector(state =>
    selectors.userPreferences(state)
  );
  const selectedAccountHasSandbox = useSelector(state => {
    const accounts = selectors.accountSummary(state);
    const selectedAccount = accounts && accounts.find(a => a.selected);

    if (selectedAccount && selectedAccount.hasSandbox) {
      return true;
    }

    return false;
  });

  function handleChange(environment) {
    dispatch(actions.user.preferences.update({ environment }));
    history.push(getRoutePath('/'));
  }

  if (!selectedAccountHasSandbox) return null;

  // TODO: Add code to hide environment if user does not have permission,
  // or their chosen account doesn't support sandbox.
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

import { useSelector, useDispatch } from 'react-redux';
// import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import TextToggle from '../../../components/TextToggle';

// const useStyles = makeStyles(() => ({}));

export default function EnvironmentToggle() {
  // const classes = useStyles();
  const dispatch = useDispatch();
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

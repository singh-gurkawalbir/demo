import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import TextToggle from '../../../components/TextToggle';
import getRoutePath from '../../../utils/routePaths';

const useStyles = makeStyles({
  TextToggle: {
    padding: 0,
  },
});

export default function EnvironmentToggle() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { environment = 'production' } = useSelector(state =>
    selectors.userPreferences(state)
  );
  const selectedAccountHasSandbox = useSelector(state => {
    const accounts = selectors.accountSummary(state);
    const selectedAccount = accounts && accounts.find(a => a.selected);

    if (
      selectedAccount &&
      (selectedAccount.hasSandbox || selectedAccount.hasConnectorSandbox)
    ) {
      return true;
    }

    return false;
  });
  const handleChange = useCallback(
    environment => {
      dispatch(actions.user.preferences.update({ environment }));
      history.push(getRoutePath('/'));
    },
    [dispatch, history]
  );

  if (!selectedAccountHasSandbox) return null;

  return (
    <TextToggle
      value={environment}
      onChange={handleChange}
      exclusive
      className={classes.TextToggle}
      options={[
        { value: 'production', label: 'Production' },
        { value: 'sandbox', label: 'Sandbox' },
      ]}
    />
  );
}

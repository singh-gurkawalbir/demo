import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import TextToggle from '../../../components/TextToggle';

const useStyles = makeStyles({
  TextToggle: {
    padding: 0,
  },
});

export default function ThemeToggle() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const themeName = useSelector(state => selectors.themeName(state));

  function handleChange() {
    dispatch(
      actions.user.preferences.update({
        themeName: themeName === 'light' ? 'sandbox' : 'light',
      })
    );
  }

  return (
    <TextToggle
      value={themeName}
      onChange={handleChange}
      exclusive
      className={classes.TextToggle}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'sandbox', label: 'Sandbox' },
      ]}
    />
  );
}

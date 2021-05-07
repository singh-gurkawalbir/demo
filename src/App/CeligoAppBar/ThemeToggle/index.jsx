import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import TextToggle from '../../../components/TextToggle';

const useStyles = makeStyles({
  TextToggle: {
    padding: 0,
  },
});

function ThemeToggle() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const themeName = useSelector(state => selectors.appTheme(state));

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
        { value: 'production', label: 'Prod' },
        { value: 'sandbox', label: 'SB' },
      ]}
    />
  );
}

export default function ThemeToggleMemo() {
  return useMemo(() => <ThemeToggle />, []);
}

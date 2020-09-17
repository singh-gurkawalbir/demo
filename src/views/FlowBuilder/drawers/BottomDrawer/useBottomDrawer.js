import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

export default function useBottomDrawer() {
  const dispatch = useDispatch();

  const setHeight = useCallback(height => {
    dispatch(actions.user.preferences.update({ fbBottomDrawerHeight: height }));
  }, [dispatch]);

  const height = useSelector(state =>
    selectors.userPreferences(state).fbBottomDrawerHeight || 250
  );

  return [height, setHeight];
}

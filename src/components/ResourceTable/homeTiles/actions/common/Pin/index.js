import { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PinIntegrationIcon from '../../../../../icons/PinIntegrationIcon';
import { selectors } from '../../../../../../reducers';
import { emptyObject } from '../../../../../../utils/constants';
import actions from '../../../../../../actions';

export default {
  key: 'pinIntegration',
  useLabel: () => 'Pin integration',
  icon: PinIntegrationIcon,
  useOnClick: ({key}) => {
    const dispatch = useDispatch();
    const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard || emptyObject, shallowEqual);

    const handlePin = useCallback(() => {
      // push unique integration key to preferences
      if (!homePreferences.pinnedIntegrations) {
        homePreferences.pinnedIntegrations = [];
      }
      homePreferences.pinnedIntegrations.push(key);
      dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, pinnedIntegrations: homePreferences.pinnedIntegrations }}));
    }, [dispatch, homePreferences, key]);

    return handlePin;
  },
};

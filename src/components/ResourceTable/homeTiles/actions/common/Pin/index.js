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
  useOnClick: rowData => {
    const {_integrationId} = rowData;
    const dispatch = useDispatch();
    const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard || emptyObject, shallowEqual);

    const handlePin = useCallback(() => {
        homePreferences.pinnedIntegrations?.push(_integrationId);
        dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, pinnedIntegrations: homePreferences.pinnedIntegrations || [] }}));
    }, [_integrationId, dispatch, homePreferences]);

    return handlePin;
  },
};

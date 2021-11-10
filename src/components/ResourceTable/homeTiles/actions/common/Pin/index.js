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
  useOnClick: ({_integrationId, ssLinkedConnectionId}) => {
    const uniqueIntId = ssLinkedConnectionId ? `${ssLinkedConnectionId}|${_integrationId}` : _integrationId;
    const dispatch = useDispatch();
    const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard || emptyObject, shallowEqual);

    const handlePin = useCallback(() => {
        // push unique integration id to preferences
        homePreferences.pinnedIntegrations?.push(uniqueIntId);
        dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, pinnedIntegrations: homePreferences.pinnedIntegrations || [] }}));
    }, [dispatch, homePreferences, uniqueIntId]);

    return handlePin;
  },
};

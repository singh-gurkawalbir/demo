import { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import UnpinIntegrationIcon from '../../../../../icons/UnpinIntegrationIcon';
import { selectors } from '../../../../../../reducers';
import { emptyObject } from '../../../../../../utils/constants';
import actions from '../../../../../../actions';

export default {
  key: 'unpinIntegration',
  useLabel: () => 'Unpin integration',
  icon: UnpinIntegrationIcon,
  useOnClick: ({_integrationId, ssLinkedConnectionId}) => {
    const uniqueIntId = ssLinkedConnectionId ? `${ssLinkedConnectionId}|${_integrationId}` : _integrationId;
    const dispatch = useDispatch();
    const homePreferences = useSelector(state => selectors.userPreferences(state).dashboard || emptyObject, shallowEqual);

    const handleUnpin = useCallback(() => {
      const index = homePreferences.pinnedIntegrations?.indexOf(uniqueIntId);

      // if found, remove the integration from pinned list
      if (index !== -1) {
        homePreferences.pinnedIntegrations.splice(index, 1);
        dispatch(actions.user.preferences.update({ dashboard: {...homePreferences, pinnedIntegrations: homePreferences.pinnedIntegrations || [] }}));
      }
    }, [dispatch, homePreferences, uniqueIntId]);

    return handleUnpin;
  },
};

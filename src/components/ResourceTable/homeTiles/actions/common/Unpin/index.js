import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import UnpinIntegrationIcon from '../../../../../icons/UnpinIntegrationIcon';
import actions from '../../../../../../actions';

export default {
  key: 'unpinIntegration',
  useLabel: () => 'Unpin integration',
  icon: UnpinIntegrationIcon,
  useOnClick: ({key}) => {
    const dispatch = useDispatch();

    const handleUnpin = useCallback(() => {
      dispatch(actions.user.preferences.unpinIntegration(key));
    }, [dispatch, key]);

    return handleUnpin;
  },
};

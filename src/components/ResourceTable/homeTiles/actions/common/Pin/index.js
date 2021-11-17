import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PinIntegrationIcon from '../../../../../icons/PinIntegrationIcon';
import actions from '../../../../../../actions';

export default {
  key: 'pinIntegration',
  useLabel: () => 'Pin integration',
  icon: PinIntegrationIcon,
  useOnClick: ({key}) => {
    const dispatch = useDispatch();

    const handlePin = useCallback(() => {
      dispatch(actions.user.preferences.pinIntegration(key));
    }, [dispatch, key]);

    return handlePin;
  },
};

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RegenerateTokenIcon from '../../../../../components/icons/RegenerateTokenIcon';

export default {
  label: 'Regenerate token',
  icon: RegenerateTokenIcon,
  component: function RegenerateAccessToken({ resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const regenerateAccessToken = useCallback(() => {
      dispatch(actions.accessToken.generateToken(resourceId));
    }, [dispatch, resourceId]);

    useEffect(() => {
      regenerateAccessToken();
    }, [regenerateAccessToken]);

    return null;
  },
};

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RegenerateTokenIcon from '../../../../icons/RegenerateTokenIcon';

export default {
  label: 'Generate API token',
  icon: RegenerateTokenIcon,
  component: function RegenerateAccessToken({ rowData = {} }) {
    const { _id: resourceId } = rowData;
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

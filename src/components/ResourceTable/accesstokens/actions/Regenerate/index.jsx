import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RegenerateTokenIcon from '../../../../icons/RegenerateTokenIcon';

export default {
  useLabel: () => 'Generate new token',
  icon: RegenerateTokenIcon,
  useOnClick: rowData => {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const regenerateAccessToken = useCallback(() => {
      dispatch(actions.accessToken.generateToken(resourceId));
    }, [dispatch, resourceId]);

    return regenerateAccessToken;
  },
};

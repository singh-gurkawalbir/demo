import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import ReactivateTokenIcon from '../../../../icons/ReactivateTokenIcon';

export default {
  label: 'Reactivate token',
  icon: ReactivateTokenIcon,
  component: function ReactivateAccessToken({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const reactivateAccessToken = useCallback(() => {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: false,
        },
      ];

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
    }, [dispatch, resourceId, resourceType]);

    useEffect(() => {
      reactivateAccessToken();
    }, [reactivateAccessToken]);

    return null;
  },
};

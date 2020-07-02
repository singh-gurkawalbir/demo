import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RevokeTokenIcon from '../../../../icons/RevokeTokenIcon';

export default {
  label: 'Revoke API token',
  icon: RevokeTokenIcon,
  component: function RevokeAccessToken({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const revokeAccessToken = useCallback(() => {
      const patchSet = [
        {
          op: 'replace',
          path: '/revoked',
          value: true,
        },
      ];

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
    }, [dispatch, resourceId, resourceType]);

    useEffect(() => {
      revokeAccessToken();
    }, [revokeAccessToken]);

    return null;
  },
};

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import RevokeTokenIcon from '../../../../../components/icons/RevokeTokenIcon';

export default {
  title: 'Revoke token',
  icon: RevokeTokenIcon,
  component: function RevokeAccessToken({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleRevokeClick = useCallback(() => {
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
      handleRevokeClick();
    }, [handleRevokeClick]);

    return null;
  },
};

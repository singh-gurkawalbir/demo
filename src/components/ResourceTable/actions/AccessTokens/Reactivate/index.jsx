import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import ReactivateTokenIcon from '../../../../../components/icons/ReactivateTokenIcon';

export default {
  label: 'Reactivate token',
  icon: ReactivateTokenIcon,
  component: function ReactivateAccessToken({ resourceType, resource = {} }) {
    const { _id: resourceId } = resource;
    const dispatch = useDispatch();
    const handleReactivateClick = useCallback(() => {
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
      handleReactivateClick();
    }, [handleReactivateClick]);

    return null;
  },
};

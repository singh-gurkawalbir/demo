import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import RevokeTokenIcon from '../../../../icons/RevokeTokenIcon';

export default {
  useLabel: () => 'Revoke API token',
  icon: RevokeTokenIcon,
  useOnClick: rowData => {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const {resourceType} = useGetTableContext();

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

    return revokeAccessToken;
  },
};

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';
import ReactivateTokenIcon from '../../../../icons/ReactivateTokenIcon';

export default {
  useLabel: () => 'Reactivate token',
  icon: ReactivateTokenIcon,
  useOnClick: rowData => {
    const {resourceType} = useGetTableContext();

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

    return reactivateAccessToken;
  },
};

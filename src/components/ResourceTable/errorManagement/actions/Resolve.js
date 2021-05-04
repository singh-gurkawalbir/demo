import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import CheckmarkIcon from '../../../icons/CheckmarkIcon';

export default {
  useLabel: () => 'Resolve',
  icon: CheckmarkIcon,
  useOnClick: rowData => {
    const dispatch = useDispatch();
    const {flowId, resourceId} = useGetTableContext();
    const handleClick = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.resolve({
          flowId,
          resourceId,
          errorIds: [rowData.errorId],
        })
      );
    }, [dispatch, flowId, rowData.errorId, resourceId]);

    return handleClick;
  },
};

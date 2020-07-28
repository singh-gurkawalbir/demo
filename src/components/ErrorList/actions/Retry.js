import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';

export default {
  label: 'Retry',
  component: function Retry({ flowId, resourceId, rowData, isResolved }) {
    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.retry({
          flowId,
          resourceId,
          retryIds: [rowData.retryDataKey],
          isResolved,
        })
      );
    }, [dispatch, flowId, isResolved, rowData.retryDataKey, resourceId]);
    useEffect(() => {
      handleClick();
    }, [handleClick]);
    return null;
  },
};

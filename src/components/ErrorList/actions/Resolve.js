import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';

export default {
  label: 'Resolve',
  component: function Resolve({ rowData, flowId, resourceId }) {
    const dispatch = useDispatch();
    const handleClick = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.resolve({
          flowId,
          resourceId,
          errorIds: [rowData.errorId],
        })
      );
    }, [dispatch, flowId, rowData.errorId, resourceId]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import RefreshIcon from '../../../icons/RefreshIcon';

export default {
  useLabel: () => 'Retry',
  icon: RefreshIcon,
  disabledActionText: ({isFlowDisabled}) => {
    if (isFlowDisabled) {
      return 'Enable the flow to retry';
    }
  },
  component: function Retry({ flowId, resourceId, rowData, isResolved }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const handleRetry = useCallback(() => {
      dispatch(
        actions.errorManager.flowErrorDetails.retry({
          flowId,
          resourceId,
          retryIds: [rowData.retryDataKey],
          isResolved,
        })
      );
    }, [dispatch, flowId, isResolved, rowData.retryDataKey, resourceId]);
    const handleClick = useCallback(() => {
      if (!isResolved) {
        return handleRetry();
      }
      // show confirmation dialog for resolved errors trying to be retried
      confirmDialog({
        title: 'Confirm retry',
        message: 'You are requesting to retry one or more errors that have been resolved. The retry data associated with these errors represents the data at the time of the original error, and could be older and/or out of date. Please confirm you would like to proceed.',
        buttons: [
          {
            label: 'Retry',
            onClick: () => {
              handleRetry();
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [isResolved, handleRetry, confirmDialog]);

    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};

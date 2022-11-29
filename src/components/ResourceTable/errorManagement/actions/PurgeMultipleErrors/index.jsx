import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import messageStore from '../../../../../utils/messageStore';
import useConfirmDialog from '../../../../ConfirmDialog';
import PurgeIcon from '../../../../icons/PurgeIcon';

export default {
  key: 'purgeMultipleErrors',
  useLabel: ({selectedErrorCount}) => `Purge ${selectedErrorCount} selected errors`,
  icon: PurgeIcon,
  useDisabled: ({selectedErrorCount}) => !selectedErrorCount,
  useOnClick: ({flowId, resourceId}) => {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();

    const handlePurge = useCallback(() => {
      dispatch(actions.errorManager.flowErrorDetails.purge.request({flowId, resourceId}));
    }, [dispatch, flowId, resourceId]);

    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm purge error(s)',
        message: messageStore('MULTIPLE_ERROR_PURGE_CONFIRM_MESSAGE'),
        buttons: [
          {
            label: 'Purge error(s)',
            error: true,
            onClick: handlePurge,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, handlePurge]);

    return handleClick;
  },
};

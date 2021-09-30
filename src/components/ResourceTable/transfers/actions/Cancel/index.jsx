import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import CancelIcon from '../../../../icons/CancelIcon';

export default {
  key: 'cancelTransfer',
  useLabel: () => 'Cancel transfer',
  icon: CancelIcon,
  useOnClick: rowData => {
    const { _id: transferId} = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const cancelTransfer = useCallback(() => {
      dispatch(actions.transfer.cancel(transferId));
    }, [dispatch, transferId]);
    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm cancel',
        message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: cancelTransfer,
          },
          {
            label: 'No, go back',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, cancelTransfer]);

    return handleClick;
  },
};

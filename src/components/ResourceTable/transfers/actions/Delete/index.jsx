import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import TrashIcon from '../../../../icons/TrashIcon';

export default {
  key: 'deleteTransfer',
  useLabel: () => 'Delete transfer',
  icon: TrashIcon,
  mode: 'delete',
  useOnClick: rowData => {
    const { _id: transferId} = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const deleteTransfer = useCallback(() => {
      dispatch(actions.resource.delete('transfers', transferId));
    }, [dispatch, transferId]);
    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this transfer?',
        buttons: [
          {
            label: 'Delete',
            error: true,
            onClick: () => {
              deleteTransfer();
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, deleteTransfer]);

    return handleClick;
  },
};

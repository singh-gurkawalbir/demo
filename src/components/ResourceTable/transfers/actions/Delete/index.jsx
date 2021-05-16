import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import TrashIcon from '../../../../icons/TrashIcon';

export default {
  key: 'deleteTransfer',
  useLabel: () => 'Delete transfer',
  icon: TrashIcon,
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
            onClick: () => {
              deleteTransfer();
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, deleteTransfer]);

    return handleClick;
  },
};

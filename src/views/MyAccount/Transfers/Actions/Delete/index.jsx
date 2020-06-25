import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../../components/ConfirmDialog';

export default {
  label: 'Delete transfer',
  component: function Delete({ rowData: transfer }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const deleteTransfer = useCallback(() => {
      dispatch(actions.resource.delete('transfers', transfer._id));
    }, [dispatch, transfer._id]);
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
    useEffect(() => {
      handleClick();
    }, [handleClick]);

    return null;
  },
};

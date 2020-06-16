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
      const message = 'Are you sure you want to delete this transfer?';

      confirmDialog({
        title: 'Confirm',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Yes',
            onClick: () => {
              deleteTransfer();
            },
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

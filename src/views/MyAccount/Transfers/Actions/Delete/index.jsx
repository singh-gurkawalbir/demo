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
      const message = 'Most resources can be restored from the recycle bin.';

      confirmDialog({
        title: 'Delete transfer?',
        message,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Delete transfer',
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

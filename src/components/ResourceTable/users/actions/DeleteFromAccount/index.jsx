import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useConfirmDialog from '../../../../ConfirmDialog';
import actions from '../../../../../actions';

export default {
  label: 'Delete from account',
  component: function DeleteFromAccount({ rowData: user }) {
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const deleteFromAccount = useCallback(() => {
      confirmDialog({
        title: 'Confirm delete',
        message: 'Are you sure you want to delete this user?',
        buttons: [
          {
            label: 'Delete',
            onClick: () => {
              dispatch(actions.user.org.users.delete(user._id));
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, dispatch, user._id]);

    useEffect(() => deleteFromAccount(), [deleteFromAccount]);

    return null;
  },
};

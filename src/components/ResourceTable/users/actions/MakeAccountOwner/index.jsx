import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useConfirmDialog from '../../../../ConfirmDialog';
import actions from '../../../../../actions';

export default {
  label: 'Make account owner',
  component: function MakeAccountOwner({ rowData: user }) {
    const { confirmDialog } = useConfirmDialog();
    const dispatch = useDispatch();
    const makeAccountOwner = useCallback(() => {
      confirmDialog({
        title: 'Confirm owner',
        isHtml: true,
        message: 'Are you sure you want to make this user the new account owner?  All owner privileges will be transferred to them, and you will be converted to a manager.',
        buttons: [
          {
            label: 'Make owner',
            onClick: () => {
              dispatch(actions.user.org.users.makeOwner(user.email));
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, dispatch, user.email]);

    useEffect(() => makeAccountOwner(), [makeAccountOwner]);

    return null;
  },
};

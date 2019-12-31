import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import CloseIcon from '../../../../../components/icons/TrashIcon';
import { confirmDialog } from '../../../../../components/ConfirmDialog';

export default {
  label: 'Delete transfer',
  component: function Delete({ resource: transfer }) {
    const dispatch = useDispatch();
    const deleteTransfer = useCallback(() => {
      dispatch(actions.resource.delete('transfers', transfer._id));
    }, [dispatch, transfer._id]);
    const handleClick = () => {
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
    };

    return (
      <IconButton data-test="delete" size="small" onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    );
  },
};

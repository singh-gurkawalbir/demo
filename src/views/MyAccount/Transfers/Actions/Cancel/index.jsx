import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import { confirmDialog } from '../../../../../components/ConfirmDialog';

export default {
  label: 'Cancel transfer',
  component: function Cancel({ resource: transfer }) {
    const dispatch = useDispatch();
    const cancelTranfer = useCallback(() => {
      dispatch(actions.transfer.cancel(transfer._id));
    }, [dispatch, transfer._id]);
    const handleClick = () => {
      const message = 'Are you sure you want to cancel this transfer?';

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
              cancelTranfer();
            },
          },
        ],
      });
    };

    return (
      <IconButton
        disabled={transfer && transfer.status === 'canceled'}
        data-test="cancel"
        size="small"
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    );
  },
};

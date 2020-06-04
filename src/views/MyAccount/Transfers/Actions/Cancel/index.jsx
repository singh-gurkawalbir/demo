import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { IconButton } from '@material-ui/core';
import actions from '../../../../../actions';
import CancelIcon from '../../../../../components/icons/CancelIcon';
import useConfirmDialog from '../../../../../components/ConfirmDialog';

export default {
  label: 'Cancel transfer',
  component: function Cancel({ resource: transfer }) {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const cancelTransfer = useCallback(() => {
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
              cancelTransfer();
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
        <CancelIcon />
      </IconButton>
    );
  },
};

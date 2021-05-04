import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../../actions';
import useConfirmDialog from '../../../../ConfirmDialog';
import TrashIcon from '../../../../icons/TrashIcon';
import { useGetTableContext } from '../../../../CeligoTable/TableContext';

export default {
  useLabel: () => 'Delete transfer',
  icon: TrashIcon,
  useOnClick: () => {
    const dispatch = useDispatch();
    const {transfer} = useGetTableContext();
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

    return handleClick;
  },
};

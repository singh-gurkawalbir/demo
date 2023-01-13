import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import messageStore from '../../../../utils/messageStore';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import useConfirmDialog from '../../../ConfirmDialog';
import PurgeIcon from '../../../icons/PurgeIcon';

export default {
  key: 'purgeResolvedError',
  useLabel: () => 'Purge error',
  icon: PurgeIcon,
  useOnClick: rowData => {
    const { errorId } = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const {flowId, resourceId } = useGetTableContext();

    const purgeError = useCallback(() => {
      dispatch(actions.errorManager.flowErrorDetails.purge.request({flowId, resourceId, errors: [errorId], isRowAction: true}));
    }, [dispatch, flowId, resourceId, errorId]);

    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm purge error',
        message: messageStore('ERROR_PURGE_CONFIRM_MESSAGE'),
        buttons: [
          {
            label: 'Purge error',
            onClick: purgeError,
            error: true,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, purgeError]);

    return handleClick;
  },
};

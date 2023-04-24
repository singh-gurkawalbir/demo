import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import { message } from '../../../../../utils/messageStore';
import useConfirmDialog from '../../../../ConfirmDialog';
import PurgeIcon from '../../../../icons/PurgeIcon';

export default {
  key: 'purgeScriptLog',
  useLabel: () => 'Purge all logs of this script',
  useDisabledActionText: ({isPurgeAvailable}) => isPurgeAvailable ? '' : 'This script does not have any logs.',
  icon: PurgeIcon,
  mode: 'delete',
  useOnClick: ({scriptId, flowId}) => {
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();

    const purgeLogs = useCallback(() => {
      dispatch(actions.logs.scripts.purge.request({scriptId, flowId}));
    }, [dispatch, flowId, scriptId]);

    const handleClick = useCallback(() => {
      confirmDialog({
        title: 'Confirm purge all logs of the script',
        message: message.PURGE.SCRIPT_LOG_CONFIRM_MESSAGE,
        buttons: [
          {
            label: 'Purge all logs of this script',
            onClick: purgeLogs,
            error: true,
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }, [confirmDialog, purgeLogs]);

    return handleClick;
  },
};

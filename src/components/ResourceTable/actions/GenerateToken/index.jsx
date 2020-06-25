import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import RegenerateTokenIcon from '../../../icons/RegenerateTokenIcon';
import useConfirmDialog from '../../../ConfirmDialog';

export default {
  label: 'Generate new token',
  icon: RegenerateTokenIcon,
  hasAccess: ({ rowData, resourceType }) =>
    !(resourceType === 'stacks' && rowData.type === 'lambda'),
  component: function GenerateToken({ rowData = {}, resourceType }) {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const generateSystemToken = useCallback(() => {
      if (resourceType === 'agents') {
        dispatch(actions.agent.changeToken(resourceId));
      } else if (resourceType === 'stacks') dispatch(actions.stack.generateToken(resourceId));
    }, [dispatch, resourceId, resourceType]);
    const confirmGenerateToken = useCallback(() => {
      confirmDialog({
        title: 'Confirm generate',
        message:
          'Are you sure you want to generate a new token? Your old token will not work after making this change.',
        buttons: [
          {
            label: 'Generate',
            onClick: generateSystemToken,
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    }, [confirmDialog, generateSystemToken]);

    useEffect(() => {
      confirmGenerateToken();
    }, [confirmGenerateToken]);

    return null;
  },
};

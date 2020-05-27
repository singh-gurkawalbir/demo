import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import RegenerateTokenIcon from '../../../icons/RegenerateTokenIcon';
import useConfirmDialog from '../../../ConfirmDialog';

export default {
  label: 'Generate token',
  icon: RegenerateTokenIcon,
  component: function GenerateToken({ rowData = {}, resourceType }) {
    const { _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const { confirmDialog } = useConfirmDialog();
    const generateSystemToken = useCallback(() => {
      if (resourceType === 'agents') {
        dispatch(actions.agent.changeToken(resourceId));
      } else if (resourceType === 'stacks')
        dispatch(actions.stack.generateToken(resourceId));
    }, [dispatch, resourceId, resourceType]);
    const confirmGenerateToken = useCallback(() => {
      const message = [
        `Are you sure you want to generate a new token? Your old token will be replaced with a new one.`,
        `You will not be able to use your old token.`,
      ].join(' ');

      confirmDialog({
        title: 'Generate new token?',
        message,
        buttons: [
          {
            label: 'Generate token',
            onClick: generateSystemToken,
          },
          {
            label: 'Cancel',
            variant: 'text',
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

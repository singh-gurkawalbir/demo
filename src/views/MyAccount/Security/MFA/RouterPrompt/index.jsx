import { useCallback, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useConfirmDialog from '../../../../../components/ConfirmDialog';

export default function RouterPrompt({ when, onOK, onCancel}) {
  const { confirmDialog } = useConfirmDialog();
  const match = useRouteMatch();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const handleOK = useCallback(async () => {
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());

      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());

      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);

  useEffect(() => {
    if (when) {
      history.block((prompt, action) => {
        if (action !== 'POP' && !prompt.pathname.includes(match.url)) {
          setCurrentPath(prompt.pathname);
          setShowPrompt(true);

          return 'true';
        }
      });
    } else {
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, when, match.url]);

  useEffect(() => {
    if (showPrompt) {
      confirmDialog({
        title: 'Cancel MFA setup?',
        message: 'Are you sure you want to leave? Your MFA settings will be disabled unless you connect your device successfully.',
        buttons: [
          {
            label: 'Cancel',
            variant: 'filled',
            onClick: handleOK,

          },
          {
            label: 'Continue setup',
            variant: 'outlined',
            onClick: handleCancel,
          },
        ],
      });
    }
  }, [showPrompt, confirmDialog, handleCancel, handleOK]);

  return null;
}

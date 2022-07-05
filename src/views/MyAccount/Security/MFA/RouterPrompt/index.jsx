import { useCallback, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useConfirmDialog from '../../../../../components/ConfirmDialog';

// Ref: https://medium.com/nerd-for-tech/custom-react-router-prompt-d325538b4d2b
export default function RouterPrompt({ when }) {
  const { confirmDialog } = useConfirmDialog();
  const match = useRouteMatch();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const handleLeave = useCallback(() => {
    history.block(() => {});
    history.push(currentPath);
  }, [currentPath, history]);

  const handleStay = useCallback(() => {
    history.block(() => {});
    history.push(currentPath);
    setShowPrompt(false);
  }, [currentPath, history]);

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
            onClick: handleLeave,

          },
          {
            label: 'Continue setup',
            variant: 'outlined',
            onClick: handleStay,
          },
        ],
      });
    }
  }, [showPrompt, confirmDialog, handleLeave, handleStay]);

  return null;
}

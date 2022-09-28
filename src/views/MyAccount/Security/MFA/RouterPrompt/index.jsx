import { useCallback, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import messageStore from '../../../../../utils/messageStore';

// Ref: https://medium.com/nerd-for-tech/custom-react-router-prompt-d325538b4d2b
export default function RouterPrompt({ show }) {
  const { confirmDialog } = useConfirmDialog();
  const match = useRouteMatch();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const handleLeave = useCallback(() => {
    // defining an empty call back would remove any blocking of route navigation
    history.block(() => {});
    history.push(currentPath);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  const handleStay = useCallback(() => {
    setShowPrompt(false);
  }, []);

  useEffect(() => {
    if (show) {
      history.block((prompt, action) => {
        // Define a call back for history.block if the user navigates to any other route
        // action is POP when user hits back button
        if (action !== 'POP' && !prompt.pathname.includes(match.url)) {
          setCurrentPath(prompt.pathname);
          setShowPrompt(true);

          return 'true';
        }
      });
    } else {
      // defining an empty call back would remove any blocking of route navigation
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, show, match.url]);

  useEffect(() => {
    if (showPrompt) {
      confirmDialog({
        title: 'Cancel MFA setup?',
        message: messageStore('CONFIRM_LEAVE_MFA'),
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

import { useCallback, useEffect, useState } from 'react';
import { FORM_SAVE_STATUS } from '../../../utils/constants';

export default function useHandleCloseOnSave({onSave, status, onClose}) {
  const [closeTriggered, setCloseTriggered] = useState(false);
  const isTerminated = status === FORM_SAVE_STATUS.COMPLETE || status === FORM_SAVE_STATUS.FAILED;

  useEffect(() => {
    if (closeTriggered && isTerminated) {
      onClose();
      setCloseTriggered(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeTriggered, isTerminated]);

  return useCallback(closeAfterSave => {
    onSave(closeAfterSave);
    setCloseTriggered(true);
  }, [onSave]);
}

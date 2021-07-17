import { useCallback, useEffect, useState } from 'react';
import { SHOULD_FORCE_CLOSE } from '..';
import { FORM_SAVE_STATUS } from '../../../utils/constants';

export default function useHandleCloseOnSave({onSave, status, onClose, disableOnCloseAfterSave}) {
  const [closeTriggered, setCloseTriggered] = useState(false);
  const isSuccess = status === FORM_SAVE_STATUS.COMPLETE;

  useEffect(() => {
    if (disableOnCloseAfterSave) {
      return;
    }
    // SHOULD_FORCE_CLOSE directly closes the component without the dirty change dialog on save and close
    if (closeTriggered && isSuccess) {
      onClose(SHOULD_FORCE_CLOSE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeTriggered, isSuccess, disableOnCloseAfterSave]);

  return useCallback(() => {
    onSave();
    setCloseTriggered();
  }, [onSave]);
}

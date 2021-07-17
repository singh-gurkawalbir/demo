import { useEffect } from 'react';
import useFormOnCancel from '../../FormOnCancelContext';

export default function useTriggerCancelFromContext(formKey, onCloseWithDiscardWarning) {
  const {
    cancelTriggeredForAsyncKey,
    closeCancelTriggered,
  } = useFormOnCancel(formKey);

  useEffect(() => {
    if (cancelTriggeredForAsyncKey === formKey && onCloseWithDiscardWarning) {
      onCloseWithDiscardWarning();
      closeCancelTriggered();
    }
  }, [cancelTriggeredForAsyncKey, closeCancelTriggered, formKey, onCloseWithDiscardWarning]);
}

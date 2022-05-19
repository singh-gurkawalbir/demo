import { useEffect } from 'react';
import useFormOnCancelContext from '../../FormOnCancelContext';

export default function useTriggerCancelFromContext(formKey, onCloseWithDiscardWarning) {
  const {
    cancelTriggeredForAsyncKey,
    closeCancelTriggered,
  } = useFormOnCancelContext(formKey);

  useEffect(() => {
    if (formKey && cancelTriggeredForAsyncKey === formKey && onCloseWithDiscardWarning) {
      onCloseWithDiscardWarning();
      closeCancelTriggered();
    }
  }, [cancelTriggeredForAsyncKey, closeCancelTriggered, formKey, onCloseWithDiscardWarning]);
}

import { useEffect } from 'react';
import useFormOnCancel from '../../FormOnCancelContext';

export default function useTriggerCancelFromContext(formKey, onCloseWithDiscardWarning) {
  const {

    setCancelTriggered,
    cancelTriggeredForAsyncKey,
  } = useFormOnCancel();

  useEffect(() => {
    if (cancelTriggeredForAsyncKey === formKey && onCloseWithDiscardWarning) {
      onCloseWithDiscardWarning();
      setCancelTriggered(null);
    }
  }, [cancelTriggeredForAsyncKey, formKey, onCloseWithDiscardWarning, setCancelTriggered]);
}

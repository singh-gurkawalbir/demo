import { useCallback, useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../../constants';
import useHandleClickWhenValid from './useHandleClickWhenValid';

export default function useHandleRemountAfterSave(formKey, onSave, remountAfterSaveFn) {
  const [triggered, setTriggered] = useState(false);

  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey)); // get the status from the selector
  const onSaveWithTriggered = useCallback((...args) => {
    onSave(...args);
    setTriggered(true);
  }, [onSave]);

  const onClickWhenValid = useHandleClickWhenValid(formKey, onSaveWithTriggered);

  useEffect(() => {
    if (triggered && status === FORM_SAVE_STATUS.COMPLETE && remountAfterSaveFn) {
      remountAfterSaveFn();
    }
    if ([FORM_SAVE_STATUS.COMPLETE, FORM_SAVE_STATUS.FAILED, FORM_SAVE_STATUS.ABORTED].includes(status)) {
      setTriggered(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return onClickWhenValid;
}


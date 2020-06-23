import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { commStatusPerPath } from '../reducers';

export default function useSaveStatusIndicator(props) {
  const { path, onSave, disabled = false, onClose } = props;
  const [disableSave, setDisableSave] = useState(disabled);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [closeOnSuccess, setCloseOnSuccess] = useState(false);
  const commStatus = useSelector(state => commStatusPerPath(state, path, 'put'));
  const submitHandler = useCallback(
    (closeOnSave) => (values) => {
      onSave(values);
      setCloseOnSuccess(closeOnSave);
      setDisableSave(true);
      setSaveInProgress(true);
    },
    [onSave],
  );

  useEffect(() => {
    if (['success', 'error'].includes(commStatus)) {
      setSaveInProgress(false);
      setDisableSave(false);
    }
    if (commStatus === 'success' && closeOnSuccess && onClose) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commStatus]);

  const defaultLabels = useMemo(() => {
    const saveLabel = (saveInProgress && !closeOnSuccess) ? 'Saving' : 'Save';
    const saveAndCloseLabel = (saveInProgress && closeOnSuccess) ? 'Saving' : 'Save & close';
    return { saveLabel, saveAndCloseLabel };
  }, [closeOnSuccess, saveInProgress]);


  return { submitHandler, disableSave, saveInProgress, defaultLabels };
}

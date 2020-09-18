import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../reducers';

export default function useSaveStatusIndicator(props) {
  const {
    path,
    method = 'put',
    onSave,
    disabled = false,
    onClose,
  } = props;
  // Local states
  const [disableSave, setDisableSave] = useState(disabled);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [closeOnSuccess, setCloseOnSuccess] = useState(false);
  // Selector to watch for Comm status
  const commStatus = useSelector(state => selectors.commStatusPerPath(state, path, method));

  const handleSave = useCallback(values => {
    onSave(values);
    setCloseOnSuccess(false);
    setDisableSave(true);
    setSaveInProgress(true);
  }, [onSave]);

  const handleSaveClose = useCallback(values => {
    onSave(values);
    setCloseOnSuccess(true);
    setDisableSave(true);
    setSaveInProgress(true);
  }, [onSave]);

  // Generates a submitHandler which updates states on saving
  const submitHandler = useCallback(
    closeOnSave => {
      if (closeOnSave) { return handleSaveClose; }

      return handleSave;
    },
    [handleSave, handleSaveClose],
  );

  useEffect(() => {
    // watches for commStatus and updates states
    if (['success', 'error'].includes(commStatus)) {
      setSaveInProgress(false);
      setDisableSave(false);
    }
    if (commStatus === 'success' && closeOnSuccess && onClose) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commStatus]);

  // Default labels used across the application are Save, Save & close
  // If the component expects the same , can use them directly
  // If the save labels are different, this hook exposes 'saveInProgress' flag
  // using which component can update labels
  const defaultLabels = useMemo(() => {
    const saveLabel = (saveInProgress && !closeOnSuccess) ? 'Saving' : 'Save';
    const saveAndCloseLabel = (saveInProgress && closeOnSuccess) ? 'Saving' : 'Save & close';

    return { saveLabel, saveAndCloseLabel };
  }, [closeOnSuccess, saveInProgress]);

  return { submitHandler, disableSave, saveInProgress, defaultLabels };
}

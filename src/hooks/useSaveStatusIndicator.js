import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { commStatusPerPath } from '../reducers';

export default function useSaveStatusIndicator(props) {
  const {
    path,
    method = 'put',
    onSave,
    disabled = false,
    onClose
  } = props;
  // Local states
  const [disableSave, setDisableSave] = useState(disabled);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [closeOnSuccess, setCloseOnSuccess] = useState(false);
  // Selector to watch for Comm status
  const commStatus = useSelector(state => commStatusPerPath(state, path, method));
  // Generates a submitHandler which updates states on saving
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

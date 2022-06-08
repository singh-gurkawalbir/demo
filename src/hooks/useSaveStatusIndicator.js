import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../reducers';
import commKeyGen from '../utils/commKeyGenerator';
import actions from '../actions';

export default function useSaveStatusIndicator(props) {
  const {
    path,
    method = 'put',
    onSave,
    disabled = false,
    onClose,
    onSuccess,
    onFailure,
    paths,
    methods,
    remountAfterSave,
  } = props;
  const dispatch = useDispatch();
  // Local states
  const [disableSave, setDisableSave] = useState(disabled);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [closeOnSuccess, setCloseOnSuccess] = useState(false);
  // Selector to watch for Comm status
  const commStatus = useSelector(state => {
    if (paths && methods) {
      let commStatus = [];

      paths.forEach((path, i) => {
        const commStatusPerPath = selectors.commStatusPerPath(state, path, methods[i]);

        if (commStatusPerPath) {
          commStatus = [...commStatus, commStatusPerPath];
        }
      });

      return commStatus;
    }

    return [selectors.commStatusPerPath(state, path, method)];
  }, shallowEqual);

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

  const clearCommState = useCallback(() => {
    if (paths && methods) {
      paths.forEach((path, i) => {
        const key = commKeyGen(path, methods[i]);

        dispatch(actions.api.clearCommByKey(key));
      });

      return;
    }
    const key = commKeyGen(path, method);

    dispatch(actions.api.clearCommByKey(key));
  }, [dispatch, method, methods, path, paths]);

  useEffect(() => {
    // if all apis are successful, comm status should be success
    const isCommStatusSuccess = commStatus.length ? commStatus.every(commStatus => commStatus === 'success') : false;

    // if any one of the comms results in error, the comm status would be error
    const isCommStatusError = commStatus.length ? commStatus.some(commStatus => commStatus === 'error') : false;

    // watches for commStatus and updates states
    if (isCommStatusSuccess || isCommStatusError) {
      setSaveInProgress(false);
      setDisableSave(false);
      clearCommState(); // Once API call is done (success/error), clears the comm state
      remountAfterSave && remountAfterSave(); // remount the form once save completes
    }
    if (isCommStatusSuccess && onSuccess) {
      onSuccess();
    }
    if (isCommStatusError && onFailure) {
      onFailure();
    }
    if (isCommStatusSuccess && closeOnSuccess && onClose) {
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

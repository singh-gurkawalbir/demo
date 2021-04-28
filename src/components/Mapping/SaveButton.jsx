import React, { useCallback, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import { useLoadingSnackbarOnSave } from '../ResourceFormFactory/Actions';

export default function MappingSaveButton({
  submitButtonLabel = 'Save',
  variant = 'outlined',
  color = 'secondary',
  disabled = false,
  dataTest,
  showOnlyOnChanges,
  onClose,
  selectedButtonLabel,
  onClick,
}) {
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  const match = useRouteMatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { validationErrMsg } = useSelector(state => selectors.mapping(state));
  const mappingsChanged = useSelector(state => selectors.mappingChanged(state));
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted, saveInProgress } = useSelector(state =>
    selectors.mappingSaveStatus(state)
  );

  useEffect(() => {
    if (saveTriggered && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTriggered]);
  const onSave = useCallback(() => {
    dispatch(actions.mapping.save({ match }));
    setSaveTriggered(true);
  }, [dispatch, match]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType: 'mappings',
    disableSaveOnClick,
    setDisableSaveOnClick,
  });
  const handleButtonClick = useCallback(() => {
    if (validationErrMsg) {
      enqueueSnackbar({
        message: validationErrMsg,
        variant: 'error',
      });

      return;
    }
    onClick(submitButtonLabel);

    handleSubmitForm();
  }, [enqueueSnackbar, handleSubmitForm, onClick, submitButtonLabel, validationErrMsg]);

  if (showOnlyOnChanges && !mappingsChanged) {
    return null;
  }
  // console.log('disableSave, saveInProgress: ', disableSave, saveInProgress);

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={disabled || disableSave || !mappingsChanged}
      onClick={handleButtonClick}>
      {saveInProgress && selectedButtonLabel === submitButtonLabel ? (
        <>
          <Spinner size="small" /> Saving
        </>
      ) : (
        <>{submitButtonLabel}</>
      )}
    </Button>
  );
}

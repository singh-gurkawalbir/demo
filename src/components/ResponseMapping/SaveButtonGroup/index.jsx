import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import ButtonGroup from '../../ButtonGroup';
import actions from '../../../actions';
import {selectors} from '../../../reducers';
import Spinner from '../../Spinner';
import { useLoadingSnackbarOnSave } from '../../ResourceFormFactory/Actions';

const SaveButton = ({
  submitButtonLabel = 'Save',
  variant = 'outlined',
  color = 'secondary',
  disabled = false,
  dataTest,
  showOnDirty,
  onClose,
}) => {
  const [saveTrigerred, setSaveTriggered] = useState(false);
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted, saveInProgress } = useSelector(state => selectors.responseMappingSaveStatus(state), shallowEqual);
  const mappingsChanged = useSelector(state =>
    selectors.responseMappingChanged(state)
  );
  const onSave = useCallback(() => {
    dispatch(actions.responseMapping.save({ match }));
    setSaveTriggered(true);
  }, [dispatch, match]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType: 'mappings',
    disableSaveOnClick,
    setDisableSaveOnClick,
  });

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);

  const showSpinner = saveTrigerred && saveInProgress && disableSave;

  if (showOnDirty && !mappingsChanged) {
    return null;
  }

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={handleSubmitForm}>
      {showSpinner ? (
        <>
          <Spinner size="small" />
          Saving
        </>
      ) : (
        <>{submitButtonLabel}</>
      )}
    </Button>
  );
};

export default function SaveButtonGroup({ disabled, onClose}) {
  const saveInProgress = useSelector(
    state => selectors.responseMappingSaveStatus(state).saveInProgress
  );
  const mappingsChanged = useSelector(state =>
    selectors.responseMappingChanged(state)
  );
  const disableSave = !!(disabled || saveInProgress || !mappingsChanged);

  return (
    <>
      <ButtonGroup>
        <SaveButton
          disabled={disableSave}
          color="primary"
          dataTest="saveImportMapping"
          submitButtonLabel="Save"
          />
        <SaveButton
          variant="outlined"
          color="secondary"
          dataTest="saveAndCloseImportMapping"
          onClose={onClose}
          disabled={disableSave}
          submitButtonLabel="Save & close"
          showOnDirty
          />
        <Button
          variant="text"
          data-test="saveImportMapping"
          disabled={!!saveInProgress}
          onClick={onClose}>
          Cancel
        </Button>

      </ButtonGroup>
    </>
  );
}

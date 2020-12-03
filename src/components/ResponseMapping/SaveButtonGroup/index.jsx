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
  showOnlyOnChanges,
  onClose,
}) => {
  const [saveTrigerred, setSaveTriggered] = useState(false);
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const mappingsChanged = useSelector(state =>
    selectors.responseMappingChanged(state)
  );
  const { saveTerminated, saveCompleted } = useSelector(state => {
    const { saveTerminated, saveCompleted } = selectors.responseMappingSaveStatus(state);

    return { saveTerminated, saveCompleted };
  }, shallowEqual
  );

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);
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

  if (showOnlyOnChanges && !mappingsChanged) {
    return null;
  }

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={disabled || disableSave || !mappingsChanged}
      onClick={handleSubmitForm}>
      {disableSave ? (
        <>
          <Spinner size={16} />
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

  return (
    <>
      <ButtonGroup>
        <SaveButton
          disabled={!!(disabled || saveInProgress)}
          color="primary"
          dataTest="saveImportMapping"
          submitButtonLabel="Save"
          />
        <SaveButton
          variant="outlined"
          color="secondary"
          dataTest="saveAndCloseImportMapping"
          onClose={onClose}
          disabled={!!(disabled || saveInProgress)}
          submitButtonLabel="Save & close"
          showOnlyOnChanges
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

import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { selectors } from '../../../reducers';

const SaveAndCloseFileDefinitionButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    flowId,
    disabled = false,
    skipCloseOnSave = false,
    submitButtonColor = 'secondary',
    disableSaveOnClick,
    setDisableSaveOnClick,
  } = props;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [isSaving, setIsSaving] = useState(false);
  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const handleSubmitForm = useCallback(
    values => {
      let definitionRules = values['/file/filedefinition/rules'];

      try {
        definitionRules = JSON.parse(definitionRules);

        dispatch(
          actions.fileDefinitions.definition.userDefined.save(
            definitionRules,
            {
              resourceId,
              resourceType,
              values,
            },
            flowId,
            skipCloseOnSave,
          )
        );
        setIsSaving(true);
        setDisableSaveOnClick(true);
      } catch (e) {
        // Handle incase of JSON parsing error
        enquesnackbar({
          message:
            'Filedefinition rules provided is not a valid json, Please correct it.',
          variant: 'error',
        });
      }
    },
    [dispatch, enquesnackbar, flowId, resourceId, resourceType, skipCloseOnSave, setDisableSaveOnClick]
  );

  useEffect(() => {
    if (saveTerminated) {
      setIsSaving(false);
      setDisableSaveOnClick(false);
    }
  }, [saveTerminated, setDisableSaveOnClick]);

  return (
    <DynaAction
      {...props}
      color={submitButtonColor}
      disabled={disabled || disableSaveOnClick}
      onClick={handleSubmitForm}>
      {isSaving ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
};

export default SaveAndCloseFileDefinitionButton;

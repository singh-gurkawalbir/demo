import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../reducers';
import SaveAndCloseResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';

export default function SaveFileDefinitions(props) {
  const {
    // we are removing this label let it change per button Group
    // submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    disabled = false,
    flowId,
    onCancel,
    formKey,
  } = props;

  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();

  const formSaveStatus = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)?.formSaveStatus
  );

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleSubmitForm = useCallback(
    closeAfterSave => {
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
            !closeAfterSave,
          )
        );
      } catch (e) {
        // Handle incase of JSON parsing error
        enquesnackbar({
          message:
            'Filedefinition rules provided is not a valid json, Please correct it.',
          variant: 'error',
        });
      }
    },
    [values, dispatch, resourceId, resourceType, flowId, enquesnackbar]
  );

  return (
    <SaveAndCloseResourceForm
      disableOnCloseAfterSave
      formKey={formKey}
      disabled={disabled}
      status={formSaveStatus}
      onClose={onCancel}
      onSave={handleSubmitForm}
  />
  );
}

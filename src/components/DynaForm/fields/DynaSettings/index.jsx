import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import EditView from './EditView';
import FormView from './FormView';
import RawView from './RawView';

export default function DynaSettings(props) {
  const { id, resourceContext, disabled, onFieldChange } = props;
  const { resourceType, resourceId } = resourceContext;
  const [editFormMode, setEditFormMode] = useState(false);
  const settingsForm = useSelector(
    state => selectors.resource(state, resourceType, resourceId).settingsForm
  );
  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
  );
  const toggleEditMode = useCallback(() => {
    setEditFormMode(!editFormMode);
  }, [editFormMode]);
  const handleSettingFormChange = useCallback(
    (values, isValid) => {
      // console.log(isValid ? 'valid: ' : 'invalid: ', values);
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      onFieldChange(id, { ...values, __invalid: !isValid });
      // dispatch(
      //   action.formFieldChange(formId, fieldId, newValue, shouldTouch, isValid)
      // );
    },
    [id, onFieldChange]
  );
  const hasSettingsForm =
    settingsForm && (settingsForm.form || settingsForm.init);

  // only developers can see/edit raw settings!
  // thus, if there is no metadata and the user is not a dev, render nothing.
  if (!isDeveloper && hasSettingsForm) return null;

  // possibly the user is editing the form meta or init?
  // editMode can only be turned on by dev, so no need to check if user is dev here.
  if (editFormMode)
    return (
      <EditView
        resourceId={resourceId}
        settingsForm={settingsForm}
        onToggleClick={toggleEditMode}
      />
    );

  // We are not in edit mode, devs and non-devs alike should see the settings form if it exists.
  if (hasSettingsForm) {
    return (
      <FormView
        disabled={disabled}
        onFormChange={handleSettingFormChange}
        onToggleClick={toggleEditMode}
      />
    );
  }

  // the only case left is devs and no settings, so we render the raw settings editor.
  return <RawView {...props} onToggleClick={toggleEditMode} />;
}

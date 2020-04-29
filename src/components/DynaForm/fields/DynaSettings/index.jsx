import { useCallback, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as selectors from '../../../../reducers';
import EditDrawer from '../../../AFE/SettingsFormEditor/Drawer';
import FormView from './FormView';
import RawView from './RawView';
import Prototype from './prototype';

export function NewDynaSettings(props) {
  const { id, resourceContext, disabled, onFieldChange } = props;
  const { resourceType, resourceId } = resourceContext;
  const history = useHistory();
  const match = useRouteMatch();
  const settingsForm = useSelector(
    state => selectors.resource(state, resourceType, resourceId).settingsForm
  );
  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
  );
  const toggleEditMode = useCallback(() => {
    history.push(`${match.url}/editSettings`);
  }, [history, match.url]);
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
  const handleEditClose = useCallback(
    // (shouldCommit, editor) => {
    // console.log('edit drawer closed', shouldCommit, editor);
    // },
    () => history.goBack(),
    [history]
  );
  const hasSettingsForm =
    settingsForm && (settingsForm.form || settingsForm.init);

  // console.log('settingsForm', settingsForm);

  // only developers can see/edit raw settings!
  // thus, if there is no metadata and the user is not a dev, render nothing.
  if (!isDeveloper && !hasSettingsForm) return null;

  // We are not in edit mode, devs and non-devs alike should see the settings form if it exists.
  return (
    // Always render the edit drawer. This drawer has logic within to not display unless the
    // browser location ends with a specific path.
    <Fragment>
      {isDeveloper && (
        <EditDrawer
          editorId={id}
          resourceId={resourceId}
          resourceType={resourceType}
          settingsForm={settingsForm}
          onClose={handleEditClose}
        />
      )}
      {hasSettingsForm ? (
        <FormView
          resourceId={resourceId}
          resourceType={resourceType}
          disabled={disabled}
          onFormChange={handleSettingFormChange}
          onToggleClick={toggleEditMode}
        />
      ) : (
        <RawView {...props} onToggleClick={toggleEditMode} />
      )}
    </Fragment>
  );
}

export default function DynaSettingsFactory(props) {
  if (!process.env.NEW_SETTINGS || process.env.NEW_SETTINGS === 'false') {
    // console.log('use prototype settings', process.env.NEW_SETTINGS);

    return <Prototype {...props} />;
  }

  return <NewDynaSettings {...props} />;
}

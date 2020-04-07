import produce from 'immer';
import { useState, useEffect, useCallback, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Button, Typography } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { isJsonString } from '../../../utils/string';
import DynaForm from '../../DynaForm';
import EditorField from './DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
});
// const defaultSettingsMeta = {
//   fieldMap: {
//     storeName: {
//       id: 'conenction',
//       name: 'connetionId',
//       type: 'cron',
//       resourceType: 'connections',
//       helpText: 'Enter your store name, which is also your host subdomain.',
//       label: 'Store Name',
//       required: true,
//     },
//     storeName: {
//       id: 'storeName',
//       name: 'storeName',
//       type: 'text',
//       helpText: 'Enter your store name, which is also your host subdomain.',
//       label: 'Store Name',
//       required: true,
//     },
//     currency: {
//       id: 'currency',
//       name: 'currency',
//       type: 'radiogroup',
//       label: 'Currency',
//       helpKey: 'What is the default currency of your store?',
//       options: [
//         {
//           items: [{ label: 'US', value: 'us' }, { label: 'CDN', value: 'cdn' }],
//         },
//       ],
//       required: true,
//     },
//   },
//   layout: {
//     fields: ['connection', 'storeName', 'currency'],
//   },
// };

function getFieldMetaWithDefaults(fieldMeta, values) {
  return produce(fieldMeta, draft => {
    Object.keys(draft.fieldMap).forEach(key => {
      const field = draft.fieldMap[key];

      field.defaultValue = values[field.name] || '';
    });
  });
}

export default function DynaSettings(props) {
  const { id, value, disabled, resourceContext, onFieldChange } = props;
  const { resourceType, resourceId } = resourceContext;
  const classes = useStyles();
  const [settingsFormVersion, setSettingsFormVersion] = useState(0);
  const [finalMeta, setFinalMeta] = useState();
  const [editFormMode, setEditFormMode] = useState(false);
  const [alteredMeta, setAlteredMeta] = useState();
  const [metaError, setMetaError] = useState();
  const dispatch = useDispatch();
  // const fieldMeta = useSelector(state => {
  //   selectors.customFrom.meta(state);
  // });
  const fieldMeta = useSelector(state => {
    // settingsForm = { form: {[metadata]}, init: {function, _scriptId}}
    // We are going to ignore the init hook for now as there is good chance
    // devs using custom setting forms don't need this feature.

    // Note we first check if there is any staged changes to the settings form
    // and favor that over the meta stored in the resource itself. There is a
    // delay for the resource to get updated with the committed staged data while
    // the API call to update the resource is pending.
    const { settingsForm } = selectors.resource(
      state,
      resourceType,
      resourceId
    );
    const { patch } = selectors.stagedResource(state, resourceId, 'form-meta');
    const formMetaPatch =
      patch && patch.find(p => p.path === '/settingsForm/form');

    if (formMetaPatch) {
      return formMetaPatch.value;
    }

    if (settingsForm) {
      return settingsForm.form || undefined;
    }

    return undefined;
  });
  const handleToggleFormEditClick = useCallback(() => {
    if (!editFormMode) {
      let newFormEditorValue = '{}';

      if (fieldMeta) {
        newFormEditorValue = JSON.stringify(fieldMeta, null, 2);
      } else if (value && typeof value === 'object') {
        // lets auto-generate a simple form for the current settings.
        const fieldMap = {};
        const fields = [];
        const generatedMeta = { fieldMap, layout: { fields } };

        Object.keys(value).forEach(name => {
          fields.push(name);
          fieldMap[name] = {
            id: name,
            name,
            type: 'text',
            helpText: `Optional help for setting: ${name}`,
            label: name,
            required: true,
          };
        });
        newFormEditorValue = JSON.stringify(generatedMeta, null, 2);
      }

      setAlteredMeta(newFormEditorValue);
    }

    setEditFormMode(!editFormMode);
  }, [editFormMode, fieldMeta, value]);
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
  const handleFormMetaChange = useCallback((id, value) => {
    if (!isJsonString(value)) {
      setMetaError('Form metadata must be valid JSON.');
    } else {
      setMetaError();
    }

    setAlteredMeta(value);
  }, []);
  const handleSaveFormMeta = useCallback(() => {
    // console.log('save form meta!', alteredMeta);
    let meta;

    try {
      meta = JSON.parse(alteredMeta);
    } catch (e) {
      setMetaError('Form metadata must be valid JSON.');

      return;
    }

    const patchSet = [];

    if (!fieldMeta) {
      patchSet.push({ op: 'add', path: '/settingsForm', value: {} });
    }

    patchSet.push({ op: 'add', path: '/settingsForm/form', value: meta });

    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'form-meta'));
    dispatch(
      actions.resource.commitStaged(resourceType, resourceId, 'form-meta')
    );
    setEditFormMode(false);
  }, [alteredMeta, dispatch, fieldMeta, resourceId, resourceType]);

  // we only need to do this once as an "init"... value changes don't matter.
  // form metadata does matter.
  useEffect(() => {
    // console.log('Init DynaSettings fieldMeta:', value, fieldMeta);

    if (fieldMeta) {
      setFinalMeta(getFieldMetaWithDefaults(fieldMeta, value));
      setSettingsFormVersion(settingsFormVersion + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldMeta]);

  // We have 3 render paths:
  // 1) form edit where a user can edit the metadata responsible for generating the form.
  // 2) If not in edit mode, and no form metadata exists, then render a json editor
  //    to manage settings.
  // 3) if not in edit mode and we HAVE form metadata, render the form to control the settings.
  if (editFormMode) {
    return (
      <Fragment>
        <Button variant="contained" onClick={handleToggleFormEditClick}>
          Toggle form editor
        </Button>
        <EditorField
          label="Form metadata"
          id="settingsForm"
          editorClassName={classes.editor}
          mode="json"
          value={alteredMeta}
          onFieldChange={handleFormMetaChange}
        />
        <Button disabled={!!metaError} onClick={handleSaveFormMeta}>
          Save & Preview
        </Button>
        {metaError && <Typography color="error">{metaError}</Typography>}
      </Fragment>
    );
  }

  if (!finalMeta) {
    return (
      <Fragment>
        <Button onClick={handleToggleFormEditClick}>Toggle form editor</Button>
        <EditorField
          {...props}
          label="Settings"
          editorClassName={classes.editor}
          mode="json"
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Button variant="contained" onClick={handleToggleFormEditClick}>
        Toggle form editor
      </Button>
      <DynaForm
        key={settingsFormVersion}
        onChange={handleSettingFormChange}
        disabled={disabled}
        fieldMeta={finalMeta}
      />
    </Fragment>
  );
}

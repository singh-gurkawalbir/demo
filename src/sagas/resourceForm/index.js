import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
  getPatchPathForCustomForms,
  getFieldWithReferenceById,
} from '../../forms/utils';
import factory from '../../forms/formFactory';
import processorLogic from '../../reducers/session/editors/processorLogic/javascript';
import { getResource, commitStagedChanges } from '../resources';
import connectionSagas from '../resourceForm/connections';
import { requestAssistantMetadata } from '../resources/meta';
import { isNewId } from '../../utils/resource';
import { uploadRawData } from '../uploadFile';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};
Object.freeze(SCOPES);

export function* patchFormField({
  resourceType,
  resourceId,
  fieldId,
  value,
  op = 'replace',
  offset = 0,
}) {
  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!merged) return; // nothing to do.

  const meta = merged.customForm && merged.customForm.form;

  if (!meta) return; // nothing to do

  const path = getPatchPathForCustomForms(meta, fieldId, offset);
  // we try to get the corresponding fieldReference for the field so that we can patch fieldReference
  const { fieldReference } = getFieldWithReferenceById({
    meta,
    id: fieldId,
  });

  if (!path) return; // nothing to do.
  let patchFieldReference = [];
  let patchLayout = [];

  // patch the entire value into the fieldReference
  if (op === 'add') {
    // when adding a new field reference use field Id to generate the name of the field reference
    patchFieldReference = [
      {
        op,
        path: `/customForm/form/fieldMap/${value && value.id}`,
        value,
      },
    ];
    patchLayout = [{ op, path, value: value && value.id }];
  } else {
    patchFieldReference = [
      { op, path: `/customForm/form/fieldMap/${fieldReference}`, value },
    ];
  }

  // patch layout field with the reference
  const patchSet = [...patchFieldReference, ...patchLayout];

  // Apply the new patch to the session
  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.META));
}

export function* runHook({ hook, data }) {
  const { entryFunction, scriptId } = hook;
  const { merged } = yield select(selectors.resourceData, 'scripts', scriptId);

  // okay extracting script from the session
  // if it isn't there, make a call to receive the resource
  // Aren't we loading all the scripts?
  if (!merged) return; // nothing to do.

  let code = merged.content;

  if (code === undefined) {
    const origin = yield call(getResource, {
      resourceType: 'scripts',
      id: scriptId,
      message: `Loading ${merged.name} script content.`,
    });

    yield put(actions.resource.received('scripts', origin));
    code = origin.content;
  }

  const path = `/processors/javascript`;
  const opts = {
    method: 'post',
    body: processorLogic.requestBody({
      data,
      code,
      entryFunction,
    }),
  };
  const results = yield call(apiCallWithRetry, { path, opts });

  return yield results.data;
}

export function* createFormValuesPatchSet({
  resourceType,
  resourceId,
  values,
  scope,
}) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    scope
  );

  if (!resource) return { patchSet: [], finalValues: null }; // nothing to do.
  // This has the fieldMeta
  const formState = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );
  const { customForm } = resource;
  let finalValues = values;

  if (customForm && customForm.preSave) {
    // pre-save-resource
    // this resource has an embedded custom form.

    finalValues = yield call(runHook, {
      hook: customForm.preSave,
      data: values,
    });
  } else {
    const { preSave } = factory.getResourceFormAssets({
      resourceType,
      resource,
      isNew: formState.isNew,
    });

    if (typeof preSave === 'function') {
      // stock preSave handler present...

      finalValues = preSave(values, resource);
    }
  }

  const patchSet = sanitizePatchSet({
    patchSet: defaultPatchSetConverter(finalValues),
    fieldMeta: formState.fieldMeta,
    resource,
  });

  // console.log('patch set', patchSet);

  return { patchSet, finalValues };
}

export function* saveRawData({ values }) {
  const rawData = values['/rawData'];

  if (!rawData) return values;

  const rawDataKey = yield call(uploadRawData, {
    file: JSON.stringify(rawData),
  });

  return { ...values, '/rawData': rawDataKey };
}

export function* submitFormValues({ resourceType, resourceId, values, match }) {
  const formValues = values;

  if (resourceType === 'exports') {
    // @TODO Raghu:  Commented as it is a QA blocker. Decide how to save raw data
    // formValues = yield call(saveRawData, { values });
    delete formValues['/rawData'];
  }

  const { patchSet, finalValues } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values: formValues,
    scope: SCOPES.VALUE,
  });

  if (patchSet && patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  }

  const { skipCommit } = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );

  // fetch all possible pending patches.
  if (!skipCommit) {
    const { patch } = yield select(
      selectors.stagedResource,
      resourceId,
      SCOPES.VALUE
    );
    // In most cases there would be no other pending staged changes, since most
    // times a patch is followed by an immediate commit.  If however some
    // component has staged some changes, even if the patchSet above is empty,
    // we need to check the store for these un-committed ones and still call
    // the commit saga.
    let type = resourceType;

    if (resourceType === 'connectorLicenses') {
      // construct url for licenses
      const connectorUrlStr = '/connectors/';
      const startIndex =
        match.url.indexOf(connectorUrlStr) + connectorUrlStr.length;

      if (startIndex !== -1) {
        const connectorId = match.url.substring(
          startIndex,
          match.url.indexOf('/', startIndex)
        );

        type = `connectors/${connectorId}/licenses`;
      }
    }

    if (patch && patch.length) {
      yield call(commitStagedChanges, {
        resourceType: type,
        id: resourceId,
        scope: SCOPES.VALUE,
      });
    }
  }

  yield put(
    actions.resourceForm.submitComplete(resourceType, resourceId, finalValues)
  );
}

export function* saveResourceWithDefinitionID({ formValues, definitionId }) {
  const { resourceId, resourceType, values } = formValues;
  const newValues = { ...values };

  delete newValues['/file/filedefinition/rules'];
  newValues['/file/type'] = 'filedefinition';
  newValues['/file/fileDefinition/_fileDefinitionId'] = definitionId;
  yield put(actions.resourceForm.submit(resourceType, resourceId, newValues));
}

export function* initFormValues({
  resourceType,
  resourceId,
  isNew,
  skipCommit,
  flowId,
}) {
  const developerMode = yield select(selectors.developerMode);
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (isNewId(resourceId)) {
    resource._id = resourceId;
  }

  if (!resource) return; // nothing to do.
  let assistantData;

  if (['exports', 'imports'].includes(resourceType) && resource.assistant) {
    if (!resource.assistantMetadata) {
      yield put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'add', path: '/assistantMetadata', value: {} }],
          SCOPES.VALUE
        )
      );
    }

    assistantData = yield select(selectors.assistantData, {
      adaptorType: ['RESTExport', 'RESTImport'].includes(resource.adaptorType)
        ? 'rest'
        : 'http',
      assistant: resource.assistant,
    });

    if (!assistantData) {
      assistantData = yield call(requestAssistantMetadata, {
        adaptorType: ['RESTExport', 'RESTImport'].includes(resource.adaptorType)
          ? 'rest'
          : 'http',
        assistant: resource.assistant,
      });
    }
  }

  const defaultFormAssets = factory.getResourceFormAssets({
    resourceType,
    resource,
    isNew,
    assistantData,
  });
  const { customForm } = resource;
  const form =
    customForm && customForm.form
      ? customForm.form
      : defaultFormAssets.fieldMeta;
  //
  const fieldMeta = factory.getFieldsWithDefaults(
    form,
    resourceType,
    resource,
    { developerMode, flowId, ignoreFunctionTransformations: false }
  );
  let finalFieldMeta = fieldMeta;

  if (customForm && customForm.init) {
    // pre-save-resource
    // this resource has an embedded custom form.
    // TODO: if there is an error here we should show that message
    // in the UI.....and point them to the link to edit the
    // script or maybe prevent them from saving the script
    finalFieldMeta = yield call(runHook, {
      hook: customForm.init,
      data: fieldMeta,
    });
  } else if (typeof defaultFormAssets.init === 'function') {
    // standard form init fn...

    finalFieldMeta = defaultFormAssets.init(fieldMeta);
  }

  // console.log('finalFieldMeta', finalFieldMeta);
  yield put(
    actions.resourceForm.initComplete(
      resourceType,
      resourceId,
      finalFieldMeta,
      isNew,
      skipCommit
    )
  );
}

// Maybe the session could be stale...and the pre-submit values might
// be excluded
// we want to init the customForm metadata with a copy of the default metadata
// we would normally send to the DynaForm component.
export function* initCustomForm({ resourceType, resourceId }) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!resource) return; // nothing to do.

  if (resource.customForm && resource.customForm.form) {
    // init the resource custom form only if no current form exists.
    return;
  }

  const { merged: connection } = yield select(
    selectors.resourceData,
    'connections',
    resource._connectionId
  );
  const defaultFormAssets = factory.getResourceFormAssets({
    connection,
    resourceType,
    resource,
  });
  const {
    extractedInitFunctions,
    ...remainingMeta
  } = factory.getFieldsWithoutFuncs(
    defaultFormAssets && defaultFormAssets.fieldMeta,
    resource,
    resourceType
  );
  // Todo: have to write code to merge init functions
  const patchSet = [
    {
      op: 'replace',
      path: '/customForm',
      value: {
        form: remainingMeta,
      },
    },
  ];

  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.META));
}

export const resourceFormSagas = [
  takeEvery(actionTypes.RESOURCE.INIT_CUSTOM_FORM, initCustomForm),
  takeEvery(actionTypes.RESOURCE.PATCH_FORM_FIELD, patchFormField),
  takeEvery(actionTypes.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, submitFormValues),
  ...connectionSagas,
];

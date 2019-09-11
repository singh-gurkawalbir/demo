import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import {
  getFieldPosition,
  sanitizePatchSet,
  defaultPatchSetConverter,
} from '../../forms/utils';
import factory from '../../forms/formFactory';
import processorLogic from '../../reducers/session/editors/processorLogic/javascript';
import { getResource, commitStagedChanges } from '../resources';
import connectionSagas from '../resourceForm/connections';
import { requestAssistantMetadata } from '../resources/meta';
import { isNewId } from '../../utils/resource';

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

  const { index, fieldSetIndex } = getFieldPosition({ meta, id: fieldId });

  if (index === undefined) return; // nothing to do.

  const path =
    fieldSetIndex === undefined
      ? `/customForm/form/fields/${index + offset}`
      : `/customForm/form/fieldSets/${fieldSetIndex}/fields/${index + offset}`;
  const patchSet = [{ op, path, value }];

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

  if (customForm && customForm.preSubmit) {
    // pre-save-resource
    // this resource has an embedded custom form.

    finalValues = yield call(runHook, {
      hook: customForm.preSubmit,
      data: values,
    });
  } else {
    const { preSubmit } = factory.getResourceFormAssets({
      resourceType,
      resource,
      isNew: formState.isNew,
    });

    if (typeof preSubmit === 'function') {
      // stock preSubmit handler present...

      finalValues = preSubmit(values);
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

export function* submitFormValues({ resourceType, resourceId, values }) {
  const { patchSet, finalValues } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
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
    if (patch && patch.length) {
      yield call(commitStagedChanges, {
        resourceType,
        id: resourceId,
        scope: SCOPES.VALUE,
      });
    }
  }

  yield put(
    actions.resourceForm.submitComplete(resourceType, resourceId, finalValues)
  );
}

export function* initFormValues({
  resourceType,
  resourceId,
  isNew,
  skipCommit,
}) {
  let resource;

  if (isNew) {
    resource = { _id: resourceId };
  } else {
    ({ merged: resource } = yield select(
      selectors.resourceData,
      resourceType,
      resourceId
    ));

    // i could have patched that change but i wanted the tmp id to show up
    if (isNewId(resourceId)) {
      resource._id = resourceId;
    }
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
      adaptorType: resource.adaptorType === 'RESTExport' ? 'rest' : 'http',
      assistant: resource.assistant,
    });

    if (!assistantData) {
      assistantData = yield call(requestAssistantMetadata, {
        adaptorType: resource.adaptorType === 'RESTExport' ? 'rest' : 'http',
        assistant: resource.assistant,
      });
    }
  }

  const defaultFormAssets = factory.getResourceFormAssets({
    resourceType,
    resource,
    resourceId,
    isNew,
    assistantData,
  });
  const { customForm } = resource;
  const form =
    customForm && customForm.form
      ? customForm.form
      : defaultFormAssets.fieldMeta;
  //
  const fieldMeta = factory.getFieldsWithDefaults(form, resourceType, resource);
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
  const flattenedFields = factory.getFlattenedFieldMetaWithRules(
    defaultFormAssets.fieldMeta,
    resourceType
  );
  // I have fixed it with a flattened fields...but it does cascade
  // form visibility rules to its children
  const patchSet = [
    {
      op: 'replace',
      path: '/customForm',
      value: {
        form: flattenedFields,
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

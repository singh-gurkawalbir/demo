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
import pingConnectionSaga from '../resourceForm/connections';

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

  // console.log('dispatching patch with: ', patchSet);

  yield put(actions.resource.patchStaged(resourceId, patchSet));
}

export function* runHook({ hook, data }) {
  const { entryFunction, scriptId } = hook;
  const { merged } = yield select(selectors.resourceData, 'scripts', scriptId);

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
}) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!resource) return { patchSet: [], finalValues: null }; // nothing to do.

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
  } else if (typeof formState.preSubmit === 'function') {
    // stock preSubmit handler present...
    finalValues = formState.preSubmit(values);
  }

  // console.log('values before/after preSubmit: ', values, finalValues);

  const patchSet = sanitizePatchSet({
    patchSet: defaultPatchSetConverter(finalValues),
    fieldMeta: formState.fieldMeta,
    resource,
  });

  return { patchSet, finalValues };
}

export function* submitFormValues({ resourceType, resourceId, values }) {
  const { patchSet, finalValues } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
  });

  if (patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet));
    // yield put(actions.resource.commitStaged(resourceType, resourceId));
    yield call(commitStagedChanges, { resourceType, id: resourceId });
  }

  yield put(
    actions.resourceForm.submitComplete(resourceType, resourceId, finalValues)
  );
}

export function* initFormValues({ resourceType, resourceId }) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!resource) return; // nothing to do.

  // TODO: skip this if resourceType === 'connections'
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

    finalFieldMeta = yield call(runHook, {
      hook: customForm.init,
      data: fieldMeta,
    });
  } else if (typeof defaultFormAssets.init === 'function') {
    // standard form init fn...

    finalFieldMeta = defaultFormAssets.init(fieldMeta);
  }

  // console.log('fieldMeta before/after init: ', fieldMeta, finalFieldMeta);
  yield put(
    actions.resourceForm.initComplete(
      resourceType,
      resourceId,
      finalFieldMeta,
      defaultFormAssets.optionsHandler,
      defaultFormAssets.preSubmit
    )
  );
}

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
  // TODO: @Surya, we need to flatten the 'defaultFormAssets.fieldMeta'
  // to replace formId with the relevant fields
  // I have fixed it with a flattened fields...but it does cascade
  // form visibiilty rules to its childern
  const patchSet = [
    {
      op: 'replace',
      path: '/customForm',
      value: {
        form: flattenedFields,
      },
    },
  ];

  yield put(actions.resource.patchStaged(resourceId, patchSet));
}

export const resourceFormSagas = [
  takeEvery(actionTypes.RESOURCE_FORM.INIT_CUSTOM_FORM, initCustomForm),
  takeEvery(actionTypes.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, submitFormValues),
  takeEvery(actionTypes.RESOURCE.PATCH_FORM_FIELD, patchFormField),
  ...pingConnectionSaga,
];

import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import { getFieldPosition, sanitizePatchSet } from '../../forms/utils';
import factory from '../../forms/formFactory';
import processorLogic from '../../reducers/session/editors/processorLogic/javascript';
import { getResource } from '../resources';

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

  return yield results;
}

export function* submitFormValues({
  resourceType,
  resourceId,
  connection,
  values,
}) {
  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!merged) return; // nothing to do.

  const defaultFormAssets = factory.getResourceFormAssets({
    connection,
    resourceType,
    resource: merged,
  });
  let finalValues = values;
  const { customForm } = merged;
  const form =
    customForm && customForm.form
      ? customForm.form
      : defaultFormAssets.fieldMeta;
  const fieldMeta = factory.getFieldsWithDefaults(form, resourceType, merged);

  if (customForm && customForm.submit) {
    // pre-save-resource
    // this resource has an embedded custom form.

    finalValues = yield call(runHook, {
      hook: customForm.submit,
      data: values,
    });

    // eslint-disable-next-line no-console
    console.log(
      'values passed/returned to custom form submit hook: ',
      values,
      finalValues
    );
  }

  const patchSet = sanitizePatchSet({
    patchSet: defaultFormAssets.converter(finalValues),
    fieldMeta,
    merged,
  });

  if (patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet));
    yield put(actions.resource.commitStaged(resourceType, resourceId));
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

    // eslint-disable-next-line no-console
    console.log(
      'metadata passed/returned to custom form init hook: ',
      fieldMeta,
      finalFieldMeta
    );
  }

  yield put(
    actions.resourceForm.initComplete(
      resourceType,
      resourceId,
      finalFieldMeta,
      defaultFormAssets.optionsHandler
    )
  );
}

export const resourceFormSagas = [
  takeEvery(actionTypes.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, submitFormValues),
  takeEvery(actionTypes.RESOURCE.PATCH_FORM_FIELD, patchFormField),
];

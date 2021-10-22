import { select, call } from 'redux-saga/effects';
import {
  constructResourceFromFormValues,
} from '../../../utils';
import { selectors } from '../../../../reducers';
import { SCOPES } from '../../../resourceForm';

export function* getConstructedResourceObj({ flowId, resourceId, resourceType }) {
  // TODO - check for suitescript - do we need to add support at all?
  const flowDataState = yield select(selectors.getFlowDataState, flowId);
  const { formKey } = flowDataState || {};

  if (!formKey) {
    const { merged: resource = {} } = yield select(
      selectors.resourceData,
      resourceType,
      resourceId,
      SCOPES.VALUE
    );

    return resource;
  }
  // all formKey related processing goes here
  const formState = yield select(selectors.formState, formKey);

  const resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || {},
    resourceId,
    resourceType,
  })) || {};

  // HANDLE FILE ADAPTORS AND DATA LOADER - EXPORTS & IMPORTS
  // HANDLE ASSISTANTS
  // HANDLE REAL TIME

  return resourceObj;
}

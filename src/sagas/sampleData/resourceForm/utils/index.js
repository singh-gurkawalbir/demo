import { select, call } from 'redux-saga/effects';
import {
  constructResourceFromFormValues,
  constructSuiteScriptResourceFromFormValues,
} from '../../../utils';
import { selectors } from '../../../../reducers';

export function* _fetchResourceInfoFromFormKey({ formKey }) {
  const formState = yield select(selectors.formState, formKey);
  const parentContext = (yield select(selectors.formParentContext, formKey)) || {};
  const { resourceId, resourceType, integrationId, ssLinkedConnectionId } = parentContext;

  if (ssLinkedConnectionId) {
    const ssResourceObj = (yield call(constructSuiteScriptResourceFromFormValues, {
      formValues: formState?.value || {},
      resourceId,
      resourceType,
      ssLinkedConnectionId,
      integrationId,
    })) || {};

    return {
      formState,
      ...parentContext,
      resourceObj: resourceType === 'exports' ? ssResourceObj.export : ssResourceObj.import,
    };
  }
  const resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || {},
    resourceId,
    resourceType,
  })) || {};

  return {
    formState,
    ...parentContext,
    resourceObj,
  };
}

/**
 * Checks if the constructed body from formValues has same file type as saved resource
 * and if body has sampleData
 */
export function* _hasSampleDataOnResource({ formKey }) {
  const { resourceObj, resourceId, resourceType } = yield call(_fetchResourceInfoFromFormKey, { formKey });
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource || !resourceObj?.sampleData) return false;
  const resourceFileType = resource?.file?.type;
  const bodyFileType = resourceObj?.file?.type;

  if (
    ['filedefinition', 'fixed', 'delimited/edifact'].includes(bodyFileType) &&
          resourceFileType === 'filedefinition'
  ) {
    return true;
  }

  return bodyFileType === resourceFileType;
}

export function* extractResourceFormFileSampleData() {
  // common code to fetch sample data for file adaptors goes here
}

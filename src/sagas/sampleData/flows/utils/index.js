import { select, call } from 'redux-saga/effects';
import {
  constructResourceFromFormValues,
} from '../../../utils';
import { selectors } from '../../../../reducers';
import { SCOPES } from '../../../resourceForm';

export function* getConstructedResourceObj({ formKey, resourceId, resourceType }) {
  // TODO - check for suitescript - do we need to add support at all?
  if (!formKey) {
    let { merged: resource = {} } = yield select(
      selectors.resourceData,
      resourceType,
      resourceId,
      SCOPES.VALUE
    );

    if (resource?.oneToMany) {
      const oneToMany = resource.oneToMany === true || resource.oneToMany === 'true';

      resource = { ...resource, oneToMany };
    }

    return resource;
  }
  // all formKey related processing goes here
  const formState = yield select(selectors.formState, formKey);

  let resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || {},
    resourceId,
    resourceType,
  })) || {};

  if (resourceObj?.oneToMany) {
    const oneToMany = resourceObj.oneToMany === true || resourceObj.oneToMany === 'true';

    resourceObj = { ...resourceObj, oneToMany };
  }

  return resourceObj;
}

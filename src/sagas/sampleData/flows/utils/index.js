import { select, call } from 'redux-saga/effects';
import {
  constructResourceFromFormValues,
} from '../../../utils';
import { selectors } from '../../../../reducers';
import { SCOPES } from '../../../resourceForm';
import {
  isFileAdaptor,
  isAS2Resource,
  isRestCsvMediaTypeExport,
} from '../../../../utils/resource';
import { extractFileSampleDataProps } from '../../resourceForm/utils';

function* updateResourceFormFileSampleData({ resourceObj, formKey }) {
  /*
    * This saga  deals with all file types
    * checks if resource's sampleData property needs to be updated
    * check for xlsx to update csv format data on the resource's sample data prop
    * check for file defs and handle use cases as we did  in resourceForm Sample data
    */
  if (formKey) {
    const { sampleData } = yield call(extractFileSampleDataProps, { formKey });

    // eslint-disable-next-line no-param-reassign
    resourceObj.sampleData = sampleData;
  }

  return resourceObj;
}
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

  let resourceObj = (yield call(constructResourceFromFormValues, {
    formValues: formState?.value || {},
    resourceId,
    resourceType,
  })) || {};

  const { merged: connection } = yield select(
    selectors.resourceData,
    'connections',
    resourceObj._connectionId,
    SCOPES.VALUE
  );

  // HANDLE FILE ADAPTORS AND DATA LOADER - EXPORTS & IMPORTS
  if (
    isFileAdaptor(resourceObj) ||
    isAS2Resource(resourceObj) ||
    isRestCsvMediaTypeExport(resourceObj, connection)
  ) {
    resourceObj = yield call(updateResourceFormFileSampleData, {
      resourceObj,
      formKey,
    });
  }
  // HANDLE ASSISTANTS
  // HANDLE REAL TIME

  return resourceObj;
}

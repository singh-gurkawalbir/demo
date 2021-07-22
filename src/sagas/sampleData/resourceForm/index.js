import { select, takeLatest } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';

function* requestResourceFormSampleData({ formKey }) {
  const formState = yield select(selectors.formState, formKey);

  const {
    resourceType,
    resourceId,
    flowId,
  } = formState?.parentContext || {};

  console.log(resourceType, resourceId, flowId);
}

export default [
  takeLatest(actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUEST, requestResourceFormSampleData),
];


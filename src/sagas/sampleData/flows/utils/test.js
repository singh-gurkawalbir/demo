
import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { selectors } from '../../../../reducers';
import { getConstructedResourceObj } from '.';
import { constructResourceFromFormValues } from '../../../utils';

describe('flow sample data util sagas', () => {
  describe('getConstructedResourceObj saga', () => {
    const resourceId = 'export-123';
    const resourceType = 'exports';
    const formKey = 'form-export-123';

    test('should do nothing if resourceId or resourceType is not passed', () => expectSaga(getConstructedResourceObj, {})
      .not.call.fn(constructResourceFromFormValues)
      .returns(undefined)
      .run());
    test('should fetch resource from resource state if there is no formKey', () => {
      const resource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        rest: {},
      };

      expectSaga(getConstructedResourceObj, { resourceId, resourceType })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: resource }],
        ])
        .returns(resource)
        .run();
    });
    test('should fetch resource from form state if the formKey is passed', () => {
      const resource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        rest: {},
      };

      expectSaga(getConstructedResourceObj, { resourceId, resourceType, formKey })
        .provide([
          [select(selectors.formState, formKey), { value: {} }],
          [call(constructResourceFromFormValues, {formValues: {}, resourceType, resourceId }), resource],
        ])
        .returns(resource)
        .run();
    });
    test('should update oneToMany value in the resourceObj to a bool', () => {
      const resource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        oneToMany: 'true',
        rest: {},
      };
      const updatedResource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        oneToMany: true,
        rest: {},
      };

      expectSaga(getConstructedResourceObj, { resourceId, resourceType, formKey })
        .provide([
          [select(selectors.formState, formKey), { value: {} }],
          [call(constructResourceFromFormValues, {formValues: {}, resourceType, resourceId }), resource],
        ])
        .returns(updatedResource)
        .run();
      expectSaga(getConstructedResourceObj, { resourceId, resourceType })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: resource }],
        ])
        .returns(updatedResource)
        .run();
    });
    test('should return empty object if there is no resource associated with passed resourceId', () => {
      const resource = undefined;
      const resourceId = 'invalid-id';

      expectSaga(getConstructedResourceObj, { resourceId, resourceType, formKey })
        .provide([
          [select(selectors.formState, formKey)],
          [call(constructResourceFromFormValues, {formValues: {}, resourceType, resourceId }), resource],
        ])
        .returns({})
        .run();
      expectSaga(getConstructedResourceObj, { resourceId, resourceType })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: resource }],
        ])
        .returns({})
        .run();
    });
  });
});

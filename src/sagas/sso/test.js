/* global describe, test */
import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { apiCallWithRetry } from '../index';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { validateOrgId } from '.';

const invalidOrgIdErrorMessage = 'The Organization Id should be alphanumeric and starting with an alphabet and its length should be between 3 and 20';
const defaultErrorMessage = 'validation error';

describe('validateOrgId saga', () => {
  test('should dispatch validation error when no orgId is passed', () =>
    expectSaga(validateOrgId, {})
      .delay(500)
      .put(actions.sso.validationError(invalidOrgIdErrorMessage))
      .run(500)
  );
  test('should dispatch validation success if the orgId matches the sso client\'s orgId', () => {
    const orgId = 'testOrgId';
    const sampleSSOClient = {_id: '123', orgId };

    return expectSaga(validateOrgId, { orgId })
      .delay(500)
      .provide([
        [select(selectors.oidcSSOClient), sampleSSOClient],
      ])
      .put(actions.sso.validationSuccess())
      .run(500);
  });
  test('should dispatch validation error if the orgId is not a valid orgId', () => {
    const orgId = '12345';

    return expectSaga(validateOrgId, { orgId })
      .delay(500)
      .put(actions.sso.validationError(invalidOrgIdErrorMessage))
      .run(500);
  });
  test('should make an api call to validate unique orgId if orgId satisfies basic regex validation', () => {
    const orgId = 'orgId1234';

    return expectSaga(validateOrgId, { orgId })
      .delay(500)
      .call.fn(apiCallWithRetry)
      .run(500);
  });
  test('should dispatch validation success on api call success for the passed orgId', () => {
    const orgId = 'orgId1234';

    return expectSaga(validateOrgId, { orgId })
      .provide([[matchers.call.fn(apiCallWithRetry), { valid: true}]])
      .call.fn(apiCallWithRetry)
      .put(actions.sso.validationSuccess())
      .run(500);
  });
  test('should dispatch validation error on api call returns error message incase of invalid orgId passed', () => {
    const orgId = 'orgId1234';
    const error = { valid: false, errors: [{ message: invalidOrgIdErrorMessage}] };

    return expectSaga(validateOrgId, { orgId })
      .provide([[matchers.call.fn(apiCallWithRetry), error]])
      .call.fn(apiCallWithRetry)
      .put(actions.sso.validationError(invalidOrgIdErrorMessage))
      .run(500);
  });
  test('should dispatch validation error with no error messages when api call returns valid false but no error message incase of invalid orgId passed', () => {
    const orgId = 'orgId1234';
    const error = { valid: false };

    return expectSaga(validateOrgId, { orgId })
      .provide([[matchers.call.fn(apiCallWithRetry), error]])
      .call.fn(apiCallWithRetry)
      .put(actions.sso.validationError())
      .run(500);
  });
  test('should dispatch validation error on api call returns error message incase of invalid orgId passed', () => {
    const orgId = 'orgId1234';
    const error = { code: 422, message: 'unprocessable entity' };

    return expectSaga(validateOrgId, { orgId })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .put(actions.sso.validationError(defaultErrorMessage))
      .run(500);
  });
});

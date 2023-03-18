import { call, put } from 'redux-saga/effects';
import {handleLicenseErrors} from './index';
import { throwExceptionUsingTheResponse } from '../api/requestInterceptors/utils';
import actions from '../../actions';

describe('Testsuite for Handle License Errors', () => {
  test('handles subscription_required error', () => {
    const error = { data: '{"errors": [{"code": "subscription_required", "message": "Subscription is required"}]}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).toEqual(put(actions.license.receivedLicenseErrorMessage('subscription_required')));
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles entitlement_reached error', () => {
    const error = { data: '{"errors": [{"code": "entitlement_reached", "message": "Entitlement limit reached"}]}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).toEqual(put(actions.license.receivedLicenseErrorMessage('entitlement_reached', 'Entitlement limit reached')));
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles entitlement_reached error when message is not available', () => {
    const error = { data: '{"errors": [{"code": "entitlement_reached"}]}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).toEqual(put(actions.license.receivedLicenseErrorMessage('entitlement_reached', undefined)));
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error when data is not in JSON format', () => {
    const error = { data: 'Server error' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).not.toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).not.toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).not.toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error when entitlement_reached is not in code', () => {
    const error = { data: '{"errors": [{"code": "invalid_license", "message": "License is invalid"}]}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).not.toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).not.toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).not.toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error when subscription_required is not in code', () => {
    const error = { data: '{"errors": [{"code": "invalid_license", "message": "License is invalid"}]}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).not.toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).not.toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).not.toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error when data is null', () => {
    const error = { data: null };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).not.toEqual(put(actions.api.failure(path, method, null, true)));
    expect(gen.next().value).not.toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).not.toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error when isJsonString returns false', () => {
    const error = { data: 'Server error' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).not.toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).not.toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).not.toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error with entitlement_reached code', () => {
    const error = { data: '{"errors": [{"code": "entitlement_reached", "message": "Entitlement limit reached"}]}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().value).toEqual(put(actions.license.receivedLicenseErrorMessage('entitlement_reached', 'Entitlement limit reached')));
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBe(true);
  });
  test('handles error with empty code', () => {
    const error = { data: '{"errors": []}' };
    const path = '/api/users';
    const method = 'POST';
    const gen = handleLicenseErrors(error, path, method);

    expect(gen.next().done).toBe(true);
  });
});

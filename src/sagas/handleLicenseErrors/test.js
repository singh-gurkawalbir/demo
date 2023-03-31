import { call, put } from 'redux-saga/effects';
import {handleLicenseErrors} from './index';
import { throwExceptionUsingTheResponse } from '../api/requestInterceptors/utils';
import actions from '../../actions';

describe('Handle License Errors Saga', () => {
  test('handles subscription_required error', () => {
    const error = { data: 'Error message', status: 400 };
    const path = '/api/license';
    const method = 'POST';
    const code = ['subscription_required'];
    const message = ['Subscription required'];
    const gen = handleLicenseErrors(error, path, method, code, message);

    expect(gen.next().value).toEqual(put(actions.license.receivedLicenseErrorMessage('subscription_required')));
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBeTruthy();
  });
  test('handles entitlement_reached error', () => {
    const error = { data: 'Error message', status: 400 };
    const path = '/api/license';
    const method = 'POST';
    const code = ['entitlement_reached'];
    const message = ['Entitlement reached'];
    const gen = handleLicenseErrors(error, path, method, code, message);

    expect(gen.next().value).toEqual(
      put(actions.license.receivedLicenseErrorMessage('entitlement_reached', message[0]))
    );
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBeTruthy();
  });
  test('handles multiple error codes', () => {
    const error = { data: 'Error message', status: 400 };
    const path = '/api/license';
    const method = 'POST';
    const code = ['entitlement_reached', 'subscription_required'];
    const message = ['Entitlement reached', 'Subscription required'];
    const gen = handleLicenseErrors(error, path, method, code, message);

    expect(gen.next().value).toEqual(
      put(actions.license.receivedLicenseErrorMessage('subscription_required'))
    );
    expect(gen.next().value).toEqual(put(actions.api.failure(path, method, error.data, true)));
    expect(gen.next().value).toEqual(call(throwExceptionUsingTheResponse, error));
    expect(gen.next().value).toEqual({ error });
    expect(gen.next().done).toBeTruthy();
  });
  test('handles entitlement_reached error when subscription_required is not present in code', () => {
    const error = { data: 'Error message' };
    const path = '/api/license';
    const method = 'GET';
    const code = ['entitlement_reached', 'another_error'];
    const message = ['Entitlement reached message', 'Another error message'];
    const gen = handleLicenseErrors(error, path, method, code, message);

    expect(gen.next().value).toEqual(
      put(actions.license.receivedLicenseErrorMessage('entitlement_reached', message[0]))
    );
    expect(gen.next().value).toEqual(
      put(actions.api.failure(path, method, error.data, true))
    );
    expect(gen.next().value).toEqual(
      call(throwExceptionUsingTheResponse, error)
    );
    expect(gen.next().value).toEqual(
      { error }
    );
    expect(gen.next().done).toBe(true);
  });
});

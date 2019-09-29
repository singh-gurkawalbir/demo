/* global describe, test, expect */
import { call, put, delay } from 'redux-saga/effects';
import actions from '../../actions';
import { displayToken, generateToken } from './';
import { apiCallWithRetry } from '../';
import getRequestOptions from '../../utils/requestOptions';
import actionTypes from '../../actions/types';

describe('displayToken saga', () => {
  test('should display token successfully', () => {
    const tokenId = 'something';
    const tokenInPlainText = 'token in plain text';
    const saga = displayToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Getting Token',
      })
    );
    expect(saga.next({ _id: tokenId, token: tokenInPlainText }).value).toEqual(
      put(
        actions.accessToken.tokenReceived({
          _id: tokenId,
          token: tokenInPlainText,
        })
      )
    );
    expect(saga.next().value).toEqual(
      delay(process.env.MASK_SENSITIVE_INFO_DELAY)
    );
    expect(saga.next().value).toEqual(
      put(
        actions.accessToken.maskToken({
          _id: tokenId,
        })
      )
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly while displaying token', () => {
    const tokenId = 'something';
    const saga = displayToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Getting Token',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});

describe('generateToken saga', () => {
  test('should generate token successfully', () => {
    const tokenId = 'something';
    const tokenInPlainText = 'token in plain text';
    const saga = generateToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Generating Token',
      })
    );
    expect(saga.next({ _id: tokenId, token: tokenInPlainText }).value).toEqual(
      put(
        actions.accessToken.tokenReceived({
          _id: tokenId,
          token: tokenInPlainText,
        })
      )
    );
    expect(saga.next().value).toEqual(
      delay(process.env.MASK_SENSITIVE_INFO_DELAY)
    );
    expect(saga.next().value).toEqual(
      put(
        actions.accessToken.maskToken({
          _id: tokenId,
        })
      )
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly while generating token', () => {
    const tokenId = 'something';
    const saga = generateToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN_TOKEN_GENERATE,
      {
        resourceId: tokenId,
      }
    );
    const { path, opts } = requestOptions;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts,
        message: 'Generating Token',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});

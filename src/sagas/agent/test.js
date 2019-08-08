/* global describe, test, expect */
import { call, put, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { displayToken, changeToken } from './';
import { MASK_AGENT_TOKEN_DELAY } from '../../utils/constants';

describe('agent tokens sagas', () => {
  describe('displayToken saga', () => {
    test('should display token successfully', () => {
      const tokenId = 'something';
      const tokenInPlainText = 'token in plain text';
      const saga = displayToken({ id: tokenId });
      const requestOptions = getRequestOptions(
        actionTypes.AGENT.TOKEN_DISPLAY,
        {
          resourceId: tokenId,
        }
      );
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Getting Agent Token',
        })
      );
      expect(
        saga.next({ _id: tokenId, token: tokenInPlainText }).value
      ).toEqual(
        put(
          actions.agent.tokenReceived({
            _id: tokenId,
            token: tokenInPlainText,
          })
        )
      );
      expect(saga.next().value).toEqual(delay(MASK_AGENT_TOKEN_DELAY));
      expect(saga.next().value).toEqual(
        put(
          actions.agent.maskToken({
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
        actionTypes.AGENT.TOKEN_DISPLAY,
        {
          resourceId: tokenId,
        }
      );
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Getting Agent Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('changeToken saga', () => {
    test('should Change token successfully', () => {
      const tokenId = 'something';
      const tokenInPlainText = 'token in plain text';
      const saga = changeToken({ id: tokenId });
      const requestOptions = getRequestOptions(actionTypes.AGENT.TOKEN_CHANGE, {
        resourceId: tokenId,
      });
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Changing Agent Token',
        })
      );
      expect(
        saga.next({ _id: tokenId, token: tokenInPlainText }).value
      ).toEqual(
        put(
          actions.agent.tokenReceived({
            _id: tokenId,
            token: tokenInPlainText,
          })
        )
      );
      expect(saga.next().value).toEqual(delay(MASK_AGENT_TOKEN_DELAY));
      expect(saga.next().value).toEqual(
        put(
          actions.agent.maskToken({
            _id: tokenId,
          })
        )
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly while changing token', () => {
      const tokenId = 'something';
      const saga = changeToken({ id: tokenId });
      const requestOptions = getRequestOptions(actionTypes.AGENT.TOKEN_CHANGE, {
        resourceId: tokenId,
      });
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Changing Agent Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });
});

/* global describe, test, expect */
import { call, put, delay } from 'redux-saga/effects';
import actions, { availableOSTypes } from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { displayToken, changeToken, downloadInstaller } from './';

describe('agent tokens sagas', () => {
  describe('displayToken saga', () => {
    test('should display token successfully', () => {
      const tokenId = 'something';
      const tokenInPlainText = 'token in plain text';
      const saga = displayToken({ id: tokenId });
      const { path, opts } = getRequestOptions(
        actionTypes.AGENT.TOKEN_DISPLAY,
        {
          resourceId: tokenId,
        }
      );

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
      expect(saga.next().value).toEqual(
        delay(process.env.MASK_SENSITIVE_INFO_DELAY)
      );
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
      const { path, opts } = getRequestOptions(
        actionTypes.AGENT.TOKEN_DISPLAY,
        {
          resourceId: tokenId,
        }
      );

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
      const { path, opts } = getRequestOptions(actionTypes.AGENT.TOKEN_CHANGE, {
        resourceId: tokenId,
      });

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
      expect(saga.next().value).toEqual(
        delay(process.env.MASK_SENSITIVE_INFO_DELAY)
      );
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
      const { path, opts } = getRequestOptions(actionTypes.AGENT.TOKEN_CHANGE, {
        resourceId: tokenId,
      });

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
availableOSTypes.forEach(osType => {
  describe(`downloadInstaller("${osType}", id) saga`, () => {
    const id = 123;

    test('should succeed on successful api call', () => {
      const saga = downloadInstaller(
        actions.agent.downloadInstaller(osType, id)
      );
      const { path, opts } = getRequestOptions(
        actionTypes.AGENT.DOWNLOAD_INSTALLER,
        {
          osType,
          resourceId: id,
        }
      );
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Download Installer',
        })
      );

      const final = saga.next();

      expect(final.done).toBe(true);
    });
    test('should handle api error properly while downloading token', () => {
      const saga = downloadInstaller(
        actions.agent.downloadInstaller(osType, id)
      );
      const { path, opts } = getRequestOptions(
        actionTypes.AGENT.DOWNLOAD_INSTALLER,
        {
          osType,
          resourceId: id,
        }
      );
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Download Installer',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });
});

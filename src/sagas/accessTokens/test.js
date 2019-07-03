/* global describe, test, expect */
import { call, put, delay, select } from 'redux-saga/effects';
import each from 'jest-each';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import {
  displayToken,
  generateToken,
  create,
  update,
  revoke,
  deleteAccessToken,
  modifyTokenData,
} from './';
import { MASK_ACCESSTOKEN_TOKEN_DELAY } from '../../utils/constants';
import * as selectors from '../../reducers/index';

describe('access tokens sagas', () => {
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
      expect(
        saga.next({ _id: tokenId, token: tokenInPlainText }).value
      ).toEqual(
        put(
          actions.accessToken.tokenReceived({
            _id: tokenId,
            token: tokenInPlainText,
          })
        )
      );
      expect(saga.next().value).toEqual(delay(MASK_ACCESSTOKEN_TOKEN_DELAY));
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
      expect(
        saga.next({ _id: tokenId, token: tokenInPlainText }).value
      ).toEqual(
        put(
          actions.accessToken.tokenReceived({
            _id: tokenId,
            token: tokenInPlainText,
          })
        )
      );
      expect(saga.next().value).toEqual(delay(MASK_ACCESSTOKEN_TOKEN_DELAY));
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

  describe('modifyTokenData saga', () => {
    const testCases = [
      [
        { something: 'some thing', somethingElse: 'some thing else' },
        { something: 'some thing', somethingElse: 'some thing else' },
      ],
      [
        { something: 'some thing', somethingElse: 'some thing else' },
        {
          something: 'some thing',
          somethingElse: 'some thing else',
          fullAccess: false,
        },
      ],
      [
        { fullAccess: true },
        {
          fullAccess: true,
          _connectionIds: ['c1'],
          _exportIds: ['e1', 'e2'],
          _importIds: ['i1'],
        },
      ],
      [
        {
          something: 'some thing',
          somethingElse: 'some thing else',
          _integrationId: 'i1',
          _connectorId: 'c1',
        },
        {
          something: 'some thing',
          somethingElse: 'some thing else',
          fullAccess: false,
          _integrationId: 'i1',
        },
      ],
      [
        { fullAccess: true, _integrationId: 'i2', _connectorId: 'c2' },
        {
          fullAccess: true,
          _connectionIds: ['c1'],
          _exportIds: ['e1', 'e2'],
          _importIds: ['i1'],
          _integrationId: 'i2',
        },
      ],
      [
        {
          something: 'some thing',
          somethingElse: 'some thing else',
          _integrationId: 'i3',
        },
        {
          something: 'some thing',
          somethingElse: 'some thing else',
          fullAccess: false,
          _integrationId: 'i3',
        },
      ],
      [
        { fullAccess: true, _integrationId: 'something' },
        {
          fullAccess: true,
          _connectionIds: ['c1'],
          _exportIds: ['e1', 'e2'],
          _importIds: ['i1'],
          _integrationId: 'something',
        },
      ],
    ];
    const integrations = [
      { _id: 'i1', _connectorId: 'c1' },
      { _id: 'i2', _connectorId: 'c2' },
      {
        _id: 'i3',
      },
    ];

    each(testCases).test('should return %o for %o', (expected, accessToken) => {
      const saga = modifyTokenData(accessToken);

      if (accessToken._integrationId) {
        expect(saga.next().value).toEqual(
          select(selectors.resourceList, { type: 'integrations' })
        );
        expect(saga.next({ resources: integrations }).value).toEqual(expected);
      } else {
        expect(saga.next().value).toEqual(expected);
      }

      expect(saga.next().done).toEqual(true);
    });
  });

  describe('create saga', () => {
    test('should create access token (diy) successfully', () => {
      const accessToken = {
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = create({ accessToken });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_CREATE);
      const { path, opts } = requestOptions;

      expect(saga.next(accessToken).value).toEqual(
        call(modifyTokenData, accessToken)
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Creating Access Token',
        })
      );

      const response = { ...accessToken, _id: 'something' };

      expect(saga.next(response).value).toEqual(
        put(actions.accessToken.created(response))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should create connector integration access token successfully', () => {
      const accessToken = {
        something: 'something',
        somethingElse: 'something else',
        _integrationId: 'integration1',
      };
      const saga = create({ accessToken });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_CREATE, {
        integrationId: accessToken._integrationId,
      });
      const { path, opts } = requestOptions;

      expect(saga.next(accessToken).value).toEqual(
        call(modifyTokenData, accessToken)
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Creating Access Token',
        })
      );

      const response = { ...accessToken, _id: 'something' };

      expect(saga.next(response).value).toEqual(
        put(actions.accessToken.created(response))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly while creating access token', () => {
      const accessToken = {
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = create({ accessToken });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_CREATE);
      const { path, opts } = requestOptions;

      expect(saga.next(accessToken).value).toEqual(
        call(modifyTokenData, accessToken)
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Creating Access Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);

      expect(saga.next().done).toEqual(true);
    });
  });

  describe('update saga', () => {
    test('should update access token (diy) successfully', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = update({ accessToken });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_UPDATE, {
        resourceId: accessToken._id,
      });
      const { path, opts } = requestOptions;

      expect(saga.next(accessToken).value).toEqual(
        call(modifyTokenData, accessToken)
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Updating Access Token',
        })
      );

      const response = { ...accessToken };

      expect(saga.next(response).value).toEqual(
        put(actions.accessToken.updated(response))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should update connector integration access token successfully', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
        _integrationId: 'integration1',
      };
      const saga = update({ accessToken });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_UPDATE, {
        resourceId: accessToken._id,
      });
      const { path, opts } = requestOptions;

      expect(saga.next(accessToken).value).toEqual(
        call(modifyTokenData, accessToken)
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Updating Access Token',
        })
      );

      const response = { ...accessToken };

      expect(saga.next(response).value).toEqual(
        put(actions.accessToken.updated(response))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly while updating access token', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = update({ accessToken });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_UPDATE, {
        resourceId: accessToken._id,
      });
      const { path, opts } = requestOptions;

      expect(saga.next(accessToken).value).toEqual(
        call(modifyTokenData, accessToken)
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Updating Access Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);

      expect(saga.next().done).toEqual(true);
    });
  });

  describe('revoke saga', () => {
    test('should revoke access token (diy) successfully', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = revoke({ id: accessToken._id });

      expect(saga.next().value).toEqual(
        select(selectors.accessTokenList, 'all')
      );

      expect(saga.next([accessToken]).value).toEqual(
        call(update, { accessToken: { ...accessToken, revoked: true } })
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should revoke connector integration access token successfully', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
        _integrationId: 'integration1',
      };
      const saga = revoke({ id: accessToken._id });

      expect(saga.next().value).toEqual(
        select(selectors.accessTokenList, 'all')
      );

      expect(saga.next([accessToken]).value).toEqual(
        call(update, { accessToken: { ...accessToken, revoked: true } })
      );
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('delete saga', () => {
    test('should delete access token (diy) successfully', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = deleteAccessToken({ id: accessToken._id });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_DELETE, {
        resourceId: accessToken._id,
      });
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Deleting Access Token',
        })
      );

      expect(saga.next().value).toEqual(
        put(actions.accessToken.deleted(accessToken._id))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should delete connector integration access token successfully', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
        _integrationId: 'integration1',
      };
      const saga = deleteAccessToken({ id: accessToken._id });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_DELETE, {
        resourceId: accessToken._id,
      });
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Deleting Access Token',
        })
      );

      expect(saga.next().value).toEqual(
        put(actions.accessToken.deleted(accessToken._id))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly while deleting access token', () => {
      const accessToken = {
        _id: 'someId',
        something: 'something',
        somethingElse: 'something else',
      };
      const saga = deleteAccessToken({ id: accessToken._id });
      const requestOptions = getRequestOptions(actionTypes.ACCESSTOKEN_DELETE, {
        resourceId: accessToken._id,
      });
      const { path, opts } = requestOptions;

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
          message: 'Deleting Access Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);

      expect(saga.next().done).toEqual(true);
    });
  });
});


import { call, put, delay, fork, take, select, cancel} from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { createMockTask } from '@redux-saga/testing-utils';
import actions from '../../actions';
import { displayToken, generateToken, resourcesReceived, accessTokensUpdated, checkAndRemovePurgedTokens} from '.';
import { apiCallWithRetry } from '..';
import getRequestOptions from '../../utils/requestOptions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';

describe('displayToken saga', () => {
  test('should display token successfully', () => {
    const tokenId = 'something';
    const tokenInPlainText = 'token in plain text';
    const saga = displayToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN.DISPLAY,
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
    expect(saga.next().done).toBe(true);
  });
  test('should handle api error properly while displaying token', () => {
    const tokenId = 'something';
    const saga = displayToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN.DISPLAY,
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
    expect(saga.throw(new Error()).value).toBe(true);
    expect(saga.next().done).toBe(true);
  });
});

describe('generateToken saga', () => {
  test('should generate token successfully', () => {
    const tokenId = 'something';
    const tokenInPlainText = 'token in plain text';
    const saga = generateToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN.GENERATE,
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
    expect(saga.next().done).toBe(true);
  });
  test('should handle api error properly while generating token', () => {
    const tokenId = 'something';
    const saga = generateToken({ id: tokenId });
    const requestOptions = getRequestOptions(
      actionTypes.ACCESSTOKEN.GENERATE,
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
    expect(saga.throw(new Error()).value).toBe(true);
    expect(saga.next().done).toBe(true);
  });
});
describe('resourcesReceived saga', () => {
  test('should able to update collection successfully', () => expectSaga(resourcesReceived, { resourceType: 'accesstokens' })

    .put(actions.accessToken.updatedCollection())
    .run());
  test('should able to skip update collection if resource type is not accesstokens', () => {
    const saga = resourcesReceived({ resourceType: 'connections' });

    expect(saga.next().done).toBe(true);
  });
});
describe('Updated access tokens saga', () => {
  test('should able to watch updated access tokens', () => {
    const mockTask = createMockTask();

    const saga = accessTokensUpdated();

    expect(saga.next().value).toEqual(fork(checkAndRemovePurgedTokens));

    expect(saga.next(mockTask).value).toEqual(
      take(actionTypes.ACCESSTOKEN.UPDATED_COLLECTION)
    );
    expect(saga.next().value).toEqual(cancel(mockTask));
    expect(saga.next().done).toBe(true);
  });
});
describe('checkAndRemovePurgedTokens saga', () => {
  test('should return false and not dispatch any actions if there are no accessTokens present', () => {
    const data = { resources: undefined };

    expectSaga(checkAndRemovePurgedTokens)
      .provide([
        [select(selectors.resourceList, { type: 'accesstokens' }), data],
      ])
      .not.delay(Math.max(new Date('something') - new Date(), 0))
      .not.put(actions.accessToken.deletePurged())
      .not.put(actions.accessToken.updatedCollection())
      .returns(false)
      .run();
  });
  test('should be able to delete and update the collection if autoPurge is present', () => {
    const data = {
      resources: [
        {
          _id: '61dd18239e70b9780319a380',
          token: '******',
          name: 'test 2',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:39:47.065Z',
          lastModified: '2022-01-11T05:39:47.082Z',
          autoPurgeAt: '2022-01-11T09:39:46.726Z',
        },
        {
          _id: '61dd18179e70b9780319a37e',
          token: '******',
          name: 'test',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:39:35.424Z',
          lastModified: '2022-01-11T05:39:35.439Z',
          autoPurgeAt: '2022-01-11T06:39:35.083Z',
        },
        {
          _id: '61dd18239e70b9780319a389',
          token: '******',
          name: 'test 3',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:40:47.065Z',
          lastModified: '2022-01-11T05:40:47.082Z',
          autoPurgeAt: '2022-01-11T09:40:46.726Z',
        },
        {
          _id: '61dd18239e70b9780319a388',
          token: '******',
          name: 'test 4',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:50:47.065Z',
          lastModified: '2022-01-11T05:50:47.082Z',
        },
      ],
    };

    expectSaga(checkAndRemovePurgedTokens)
      .provide([
        [select(selectors.resourceList, { type: 'accesstokens' }), data],
      ])
      .delay(Math.max(new Date('2022-01-11T06:39:35.083Z') - new Date(), 0))
      .put(actions.accessToken.deletePurged())
      .put(actions.accessToken.updatedCollection())
      .run();
  });
  test('should return false if autoPurge is not present in any accessTokens', () => {
    const data = {
      resources: [
        {
          _id: '61dd18239e70b9780319a380',
          token: '******',
          name: 'test 2',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:39:47.065Z',
          lastModified: '2022-01-11T05:39:47.082Z',
        },
        {
          _id: '61dd18179e70b9780319a37e',
          token: '******',
          name: 'test',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:39:35.424Z',
          lastModified: '2022-01-11T05:39:35.439Z',
        },
        {
          _id: '61dd18239e70b9780319a389',
          token: '******',
          name: 'test 3',
          revoked: false,
          fullAccess: true,
          legacyNetSuite: false,
          _exportIds: [],
          _importIds: [],
          _apiIds: [],
          _connectionIds: [],
          createdAt: '2022-01-11T05:40:47.065Z',
          lastModified: '2022-01-11T05:40:47.082Z',
        },
      ],
    };

    expectSaga(checkAndRemovePurgedTokens)
      .provide([
        [select(selectors.resourceList, { type: 'accesstokens' }), data],
      ])
      .returns(false)
      .run();
  });
});

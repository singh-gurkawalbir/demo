/* global describe, test, expect */
import { call, put, delay } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import {
  displayToken,
  generateToken,
  getStackShareCollection,
  deleteStackShareUser,
  inviteStackShareUser,
  toggleUserStackSharing,
} from './';

describe('system token sagas', () => {
  const tokenId = 'something';
  const tokenInPlainText = 'token in plain text';
  const path = `/stacks/${tokenId}/systemToken`;

  describe('displayToken saga', () => {
    test('should display token successfully', () => {
      const saga = displayToken({ id: tokenId });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
          message: 'Getting Stack Token',
        })
      );
      expect(
        saga.next({ _id: tokenId, token: tokenInPlainText }).value
      ).toEqual(
        put(
          actions.stack.tokenReceived({
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
          actions.stack.maskToken({
            _id: tokenId,
          })
        )
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly while displaying token', () => {
      const saga = displayToken({ id: tokenId });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
          message: 'Getting Stack Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(undefined);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('generateToken saga', () => {
    test('should generate token successfully', () => {
      const saga = generateToken({ id: tokenId });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'DELETE',
          },
          message: 'Deleting Stack Token',
        })
      );
      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
          message: 'Generating Stack Token',
        })
      );
      expect(
        saga.next({ _id: tokenId, token: tokenInPlainText }).value
      ).toEqual(
        put(
          actions.stack.tokenReceived({
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
          actions.stack.maskToken({
            _id: tokenId,
          })
        )
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly while deleting or generating token', () => {
      const saga = generateToken({ id: tokenId });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'DELETE',
          },
          message: 'Deleting Stack Token',
        })
      );
      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
          message: 'Generating Stack Token',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(undefined);
      expect(saga.next().done).toEqual(true);
    });
  });
});
describe('stack sharing sagas', () => {
  describe('getStackShareCollection saga', () => {
    const path = '/sshares';
    const mockStackShareCollection = [{ id: 1 }, { id: 2 }];

    test('should succeed on successful api call', () => {
      const saga = getStackShareCollection();
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
          message: 'Getting Stack Share Collection',
        })
      );
      const effect = saga.next(mockStackShareCollection).value;

      expect(effect).toEqual(
        put(
          actions.stack.receivedStackShareCollection({
            collection: mockStackShareCollection,
          })
        )
      );
      expect(saga.next().done).toBe(true);
    });
    test('should return undefined if api call fails', () => {
      const saga = getStackShareCollection();
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
          message: 'Getting Stack Share Collection',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(undefined);
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('deleteStackShareUser saga', () => {
    const userId = '123';
    const path = `/sshares/${userId}`;

    test('should succeed on successful api call', () => {
      const saga = deleteStackShareUser({ userId });
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'DELETE',
          },
          message: 'Deleting Stack Share User',
        })
      );
      const effect = saga.next().value;

      expect(effect).toEqual(
        put(
          actions.stack.deletedStackShareUser({
            userId,
          })
        )
      );
      expect(saga.next().done).toBe(true);
    });
    test('should return undefined if api call fails', () => {
      const saga = deleteStackShareUser({ userId });
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'DELETE',
          },
          message: 'Deleting Stack Share User',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(undefined);
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('inviteStackShareUser sagas', () => {
    const stackId = '123';
    const email = 'abc@celigo.com';
    const path = `/stacks/${stackId}/invite`;

    test('should succeed on successful api call', () => {
      const saga = inviteStackShareUser({ email, stackId });
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'POST',
            body: { email },
          },
          message: 'Inviting Stack Share User',
        })
      );
      const effect = saga.next().value;

      expect(effect).toEqual(call(getStackShareCollection));
      expect(saga.next().done).toBe(true);
    });
    test('should return undefined if api call fails', () => {
      const saga = inviteStackShareUser({ email, stackId });
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'POST',
            body: { email },
          },
          message: 'Inviting Stack Share User',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(undefined);
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('toggleUserStackSharing sagas', () => {
    const userId = '123';
    const path = `/sshares/${userId}/disable`;

    test('should succeed on successful api call', () => {
      const saga = toggleUserStackSharing({ userId });
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'PUT',
            body: {},
          },
          message: 'Toggling User Stack Sharing',
        })
      );
      const effect = saga.next().value;

      expect(effect).toEqual(
        put(actions.stack.toggledUserStackSharing({ userId }))
      );
      expect(saga.next().done).toBe(true);
    });
    test('should return undefined if api call fails', () => {
      const saga = toggleUserStackSharing({ userId });
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(
        call(apiCallWithRetry, {
          path,
          opts: {
            method: 'PUT',
            body: {},
          },
          message: 'Toggling User Stack Sharing',
        })
      );
      expect(saga.throw(new Error()).value).toEqual(undefined);
      expect(saga.next().done).toEqual(true);
    });
  });
});

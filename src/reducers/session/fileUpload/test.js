/* global describe, test, expect */
import reducer, { selectors } from '.';
import actionTypes from '../../../actions/types';

const DEFAULT_STATE = {};

describe('fileUpload reducer', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = {};
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });

  test('should return default state if the state is undefined', () => {
    const prevState = undefined;
    const currState = reducer(prevState, { type: 'RANDOM_ACTION'});

    expect(currState).toEqual(DEFAULT_STATE);
  });

  describe('FILE.PROCESS action', () => {
    test('should retain previous state in case of no fileId passed', () => {
      const prevState = {};
      const currState = reducer(prevState, { type: actionTypes.FILE.PROCESS });

      expect(currState).toEqual(prevState);
    });
    test('should show status as requested for passed fileId', () => {
      const prevState = {id2: { status: 'received', file: { test: 5 }, type: 'json'} };
      const fileId = 'id1';
      const currState = reducer(prevState, { type: actionTypes.FILE.PROCESS, fileId });

      expect(currState).toEqual({
        ...prevState,
        [fileId]: {
          status: 'requested',
        }});
    });
  });
  describe('FILE.PROCESSED action', () => {
    test('should retain previous state in case of no fileId passed', () => {
      const prevState = { id1: { status: 'requested' }};
      const currState = reducer(prevState, { type: actionTypes.FILE.PROCESSED });

      expect(currState).toEqual(prevState);
    });
    test('should show status as received and update file props', () => {
      const fileId = 'id1';
      const prevState = { [fileId]: { status: 'requested' }, id2: { status: 'received', file: { test: 5 }, type: 'json' }};
      const file = { name: 'test', id: 2 };
      const fileProps = { type: 'json', size: 2};
      const currState = reducer(prevState, { type: actionTypes.FILE.PROCESSED, fileId, file, fileProps });

      expect(currState).toEqual({
        id2: { status: 'received', file: { test: 5 }, type: 'json' },
        [fileId]: {
          status: 'received',
          file,
          ...fileProps,
        }});
    });
  });
  describe('FILE.PROCESS_ERROR action', () => {
    test('should retain previous state in case of no fileId passed', () => {
      const prevState = { id1: { status: 'requested' } };
      const currState = reducer(prevState, { type: actionTypes.FILE.PROCESS_ERROR });

      expect(currState).toEqual(prevState);
    });
    test('should update file state with the error occured ', () => {
      const fileId = 'id1';
      const prevState = { [fileId]: { status: 'requested' } };
      const error = { error: ' Cannot serialize the content '};
      const currState = reducer(prevState, { type: actionTypes.FILE.PROCESS_ERROR, fileId, error });

      expect(currState).toEqual({
        [fileId]: {
          status: 'error',
          error,
        },
      });
    });
  });
  describe('FILE.RESET action', () => {
    test('should retain previous state in case of no fileId passed', () => {
      const prevState = { id1: { status: 'requested' } };
      const currState = reducer(prevState, { type: actionTypes.FILE.RESET });

      expect(currState).toEqual(prevState);
    });
    test('should clear file state for the passed fileId ', () => {
      const file = { name: 'test', id: 2 };
      const prevState = { id1: { status: 'received', file }, id2: { status: 'requested'} };
      const currState = reducer(prevState, { type: actionTypes.FILE.RESET, fileId: 'id1' });

      expect(currState).toEqual({
        id2: {
          status: 'requested',
        },
      });
    });
  });
});

describe('uploadedFile selector', () => {
  test('should return undefined when state is undefined', () => {
    expect(selectors.getUploadedFile(undefined)).toEqual(undefined);
  });
  test('should return undefined when fileId is undefined', () => {
    const state = {
      id1: {
        status: 'received',
        file: {
          name: 'test',
          id: 1,
        },
        type: 'json',
        size: 10,
      },
    };

    expect(selectors.getUploadedFile(state)).toEqual(undefined);
  });
  test('should return file state for the passed fileId', () => {
    const state = {
      id1: {
        status: 'received',
        file: {
          name: 'test',
          id: 1,
        },
        type: 'json',
        size: 10,
      },
    };

    expect(selectors.getUploadedFile(state, 'id1')).toEqual({
      status: 'received',
      file: {
        name: 'test',
        id: 1,
      },
      type: 'json',
      size: 10,
    });
  });
});

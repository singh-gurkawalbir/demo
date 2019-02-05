/* global describe, test, expect,jest */
import { delay } from 'redux-saga';
import { advanceTo, clear } from 'jest-date-mock';
import { call, put, select } from 'redux-saga/effects';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import {
  autoEvaluateProcessor,
  evaluateProcessor,
  refreshHelperFunctions,
} from './';
import { getResource } from '../resources';

describe('evaluateProcessor saga', () => {
  test('should do nothing if no editor exists with given id', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const effect = saga.next();

    expect(effect.done).toEqual(true);
  });

  test('should complete with dispatch of failure action when editor has validation errors.', () => {
    const id = 1;
    const violations = ['violations'];
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const putEffect = saga.next({ violations }).value;

    expect(putEffect).toEqual(
      put(actions.editor.validateFailure(id, violations))
    );

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should complete with dispatch of evaluate response when editor is valid.', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const selectResponse = { processor: 'p', body: 'body' };
    const callEffect = saga.next(selectResponse).value;
    const opts = {
      method: 'post',
      body: 'body',
    };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, { path: '/processors/p', opts })
    );

    const apiResult = 'result';
    const putEffect = saga.next(apiResult).value;

    expect(putEffect).toEqual(
      put(actions.editor.evaluateResponse(id, apiResult))
    );

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should complete with dispatch of evaluate failure when api call fails.', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const selectResponse = { processor: 'p', body: 'body' };
    const callEffect = saga.next(selectResponse).value;
    const opts = {
      method: 'post',
      body: 'body',
    };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, { path: '/processors/p', opts })
    );

    const putEffect = saga.throw(new Error('boom')).value;

    expect(putEffect).toEqual(put(actions.editor.evaluateFailure(id, 'boom')));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });
});

describe('autoEvaluateProcessor saga', () => {
  const id = 1;

  test('should do nothing if no editor exists with given id', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const effect = saga.next();

    expect(effect.done).toEqual(true);
  });

  test('should do nothing if editor existsbut auto evaluate is off.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const effect = saga.next({ autoEvaluate: false });

    expect(effect.done).toEqual(true);
  });

  test('should not pause if no delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const callEffect = saga.next({ autoEvaluate: true }).value;

    expect(callEffect).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should not pause if no delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const callEffect = saga.next({ autoEvaluate: true }).value;

    expect(callEffect).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should pause if delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;
    const autoEvaluateDelay = 200;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    let callEffect = saga.next({ autoEvaluate: true, autoEvaluateDelay }).value;

    expect(callEffect).toEqual(call(delay, autoEvaluateDelay));

    callEffect = saga.next().value;
    expect(callEffect).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });
});

describe('refreshHelperFunctions saga', () => {
  process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 1;
  window.localStorage = {};

  test(`should create a new helperFunction instance when there isn't any in the local storage `, () => {
    localStorage.getItem = jest.fn().mockImplementationOnce(() => null);
    localStorage.setItem = jest.fn();
    const someDateEpoch = 1234;

    advanceTo(someDateEpoch); // reset to date time.

    const saga = refreshHelperFunctions();
    const getResourceEffect = saga.next().value;
    const mockHelperResp = {
      handlebars: { helperFunctions: ['add', 'substract'] },
    };

    expect(getResourceEffect).toEqual(
      call(getResource, {
        resourceType: 'processors',
        message: 'Getting Helper functions',
      })
    );
    saga.next(mockHelperResp).value;
    expect(localStorage.setItem).toBeCalledWith(
      'helperFunctions',
      JSON.stringify({
        updateTime: someDateEpoch,
        helperFunctions: mockHelperResp.handlebars.helperFunctions,
      })
    );

    clear();
  });

  test(`should check the updateTime in the localStorage for the helper Function to detemine if the helperFunctions need to be updated, lets consider the scenario where the update interval is larger `, () => {
    const recentDateEpoch = 1100;
    const olderDateEpoch = 1000;
    const mockHelperFunctions = ['add', 'substract'];

    // setting a threshold interval to not cause an update
    process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 200;

    localStorage.getItem = jest.fn().mockImplementationOnce(() =>
      JSON.stringify({
        updateTime: olderDateEpoch,
        helperFunctions: mockHelperFunctions,
      })
    );
    localStorage.setItem = jest.fn();
    // advance the time to be less than the interval
    advanceTo(recentDateEpoch);

    const saga = refreshHelperFunctions();

    expect(saga.next().value).toEqual(
      put(actions.editor.updateHelperFunctions(mockHelperFunctions))
    );

    clear();
  });

  test(`should check the updateTime in the localStorage for the helper Function to detemine if the helperFunctions need to be updated, lets consider the scenario where the update interval is smaller `, () => {
    const recentDateEpoch = 1100;
    const olderDateEpoch = 1000;
    const mockHelperFunctions = ['add', 'substract'];

    // setting a threshold interval to cause an update
    process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 50;

    localStorage.getItem = jest.fn().mockImplementationOnce(() =>
      JSON.stringify({
        updateTime: olderDateEpoch,
        helperFunctions: mockHelperFunctions,
      })
    );
    localStorage.setItem = jest.fn();

    // advance the time to sufficiently exceed the interval
    advanceTo(recentDateEpoch);

    const saga = refreshHelperFunctions();

    expect(saga.next().value).toEqual(
      call(getResource, {
        resourceType: 'processors',
        message: 'Getting Helper functions',
      })
    );
    const mockHelperResp = {
      handlebars: { helperFunctions: mockHelperFunctions },
    };

    // localStorage Data needs to be stringified
    saga.next(mockHelperResp).value;
    expect(localStorage.setItem).toBeCalledWith(
      'helperFunctions',
      JSON.stringify({
        updateTime: recentDateEpoch,
        helperFunctions: mockHelperResp.handlebars.helperFunctions,
      })
    );
    clear();
  });
});

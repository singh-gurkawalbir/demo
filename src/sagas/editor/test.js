/* global describe, test, expect,jest, beforeEach */

import { advanceTo, clear } from 'jest-date-mock';
import { call, put, select, delay } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../actions';
import * as selectors from '../../reducers';
import {
  autoEvaluateProcessor,
  invokeProcessor,
  evaluateProcessor,
  refreshHelperFunctions,
  saveProcessor,
} from '.';
import { commitStagedChanges, getResource } from '../resources';
import { apiCallWithRetry } from '../index';
import { APIException } from '../api';

describe('invokeProcessor saga', () => {
  test('should make api call with passed arguments', () => {
    const selectResponse = { processor: 'p', body: 'body' };
    const saga = invokeProcessor(selectResponse);
    const callEffect = saga.next(selectResponse).value;
    const opts = {
      method: 'POST',
      body: selectResponse.body,
    };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, { path: '/processors/p', opts, hidden: true })
    );
  });
});

describe('evaluateProcessor saga', () => {
  test('should do nothing if no editor exists with given id', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    let selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    selectEffect = saga.next().value;
    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const effect = saga.next();

    expect(effect.done).toEqual(true);
  });

  test('should complete with dispatch of failure action when editor has validation errors.', () => {
    const id = 1;
    const violations = ['violations'];
    const saga = evaluateProcessor({ id });
    let selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    selectEffect = saga.next().value;
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
    let selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    selectEffect = saga.next({ id, processor: 'handlebars' }).value;
    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const selectResponse = { processor: 'p', body: 'body' };
    const callEffect = saga.next(selectResponse).value;

    // we are hiding this comms message from the network snackbar
    // if there are any errors let the editor show it
    expect(callEffect).toEqual(call(invokeProcessor, selectResponse));

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
    const invalidCases = [
      {
        initOpt: new APIException({
          status: 500,
          message: 'any message',
        }),
        expectedResult: 'boom',
        skipEvaluate: true,
      },
      {
        initOpt: new APIException({
          status: 422,
          message: '{"message":"boom"}',
        }),
        expectedResult: 'boom',
      },
      {
        initOpt: new APIException({
          status: 401,
          message: '{"message":"boom", "code":"code"}',
        }),
        expectedResult: 'boom',
      },
    ];

    invalidCases.forEach(invalidCase => {
      const saga = evaluateProcessor({ id });
      let selectEffect = saga.next().value;

      expect(selectEffect).toEqual(select(selectors.editor, id));

      selectEffect = saga.next({ id, processor: 'handlebars' }).value;

      expect(selectEffect).toEqual(
        select(selectors.processorRequestOptions, id)
      );

      const selectResponse = { processor: 'p', body: 'body' };
      const callEffect = saga.next(selectResponse).value;

      expect(callEffect).toEqual(call(invokeProcessor, selectResponse));

      const putEffect = saga.throw(invalidCase.initOpt).value;

      if (!invalidCase.skipEvaluate) {
        expect(putEffect).toEqual(
          put(actions.editor.evaluateFailure(id, invalidCase.expectedResult))
        );
      }

      const finalEffect = saga.next();

      expect(finalEffect).toEqual({ done: true, value: undefined });
    });
  });
});

describe('autoEvaluateProcessor saga', () => {
  const id = 1;

  test('should do nothing if no editor exists with given id', () => {
    const saga = autoEvaluateProcessor({ id });

    expect(saga.next().value).toEqual(select(selectors.editor, id));
    expect(saga.next().value).toEqual(select(selectors.editorViolations, id));

    const effect = saga.next();

    expect(effect.done).toEqual(true);
  });

  test('should do nothing if editor exists but auto evaluate is off.', () => {
    const saga = autoEvaluateProcessor({ id });

    expect(saga.next().value).toEqual(select(selectors.editor, id));
    expect(saga.next().value).toEqual(select(selectors.editorViolations, id));

    const effect = saga.next({ autoEvaluate: false });

    expect(effect.done).toEqual(true);
  });

  test('should have default pause if no delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const defaultDelay = 1000;

    expect(saga.next().value).toEqual(select(selectors.editor, id));
    expect(saga.next({ autoEvaluate: true }).value).toEqual(
      select(selectors.editorViolations, id)
    );
    expect(saga.next().value).toEqual(delay(defaultDelay));
    expect(saga.next().value).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should pause if delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const autoEvaluateDelay = 200;

    expect(saga.next().value).toEqual(select(selectors.editor, id));
    expect(saga.next({ autoEvaluate: true, autoEvaluateDelay }).value).toEqual(
      select(selectors.editorViolations, id)
    );
    expect(saga.next().value).toEqual(delay(autoEvaluateDelay));
    expect(saga.next().value).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });
});

describe('refreshHelperFunctions saga', () => {
  process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE = 1;
  const localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn()
  };
  Object.defineProperty(window, 'localStorage', { value: localStorage });

  test('should create a new helperFunction instance when there isn\'t any in the local storage ', () => {
    localStorage.getItem = jest.fn().mockImplementationOnce(() => null);
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

  test('should check the updateTime in the localStorage for the helper Function to detemine if the helperFunctions need to be updated, lets consider the scenario where the update interval is larger ', () => {
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
    // advance the time to be less than the interval
    advanceTo(recentDateEpoch);

    const saga = refreshHelperFunctions();

    expect(saga.next().value).toEqual(
      put(actions.editor.updateHelperFunctions(mockHelperFunctions))
    );

    clear();
  });

  test('should check the updateTime in the localStorage for the helper Function to detemine if the helperFunctions need to be updated, lets consider the scenario where the update interval is smaller ', () => {
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
  test('should exit gracefully when the getResource api call fails and should not alter localStorage Helperfunctions as well', () => {
    localStorage.getItem = jest.fn().mockImplementationOnce(() => null);

    const saga = refreshHelperFunctions();
    const getResourceEffect = saga.next(undefined).value;

    expect(getResourceEffect).toEqual(
      call(getResource, {
        resourceType: 'processors',
        message: 'Getting Helper functions',
      })
    );

    expect(saga.next().done).toEqual(true);
  });
});

describe('saveProcessor saga', () => {
  const id = 123;
  let patches;

  beforeEach(() => {
    patches = {
      foregroundPatches: [
        {
          patch: [{ op: 'replace', path: '/somepath', value: 'some value' }],
          resourceType: 'imports',
          resourceId: '999',
        },
        {
          patch: [{ op: 'replace', path: '/otherpath', value: 'other value' }],
          resourceType: 'scripts',
          resourceId: '777',
        },
        {
          patch: [{ op: 'replace', path: '/path', value: 'value' }],
          resourceType: 'exports',
          resourceId: '444',
        },
      ],
      backgroundPatches: [
        {
          patch: [{ op: 'replace', path: '/connection', value: 'some value' }],
          resourceType: 'connections',
          resourceId: '111',
        },
      ],
    };
  });

  test('should do nothing if no editor exists with given id', () => {
    const saga = testSaga(saveProcessor, { id });

    saga
      .next()
      .select(selectors.editorPatchSet, id)
      .next()
      .select(selectors.editor, id)
      .next()
      .isDone();
  });

  test('should dispatch save complete action if no patch sets are given', () =>
    expectSaga(saveProcessor, { id })
      .provide([[select(selectors.editorPatchSet, id), '']])
      .put(actions.editor.saveFailed(id))
      .run());

  test('should set editor save status to complete if no foreground patch exists', async () => {
    delete patches.foregroundPatches;

    const { effects } = await expectSaga(saveProcessor, { id })
      .provide([[select(selectors.editorPatchSet, id), patches]])
      .not.call.fn(commitStagedChanges)
      .put(actions.editor.saveComplete(id))
      .run();

    expect(effects.call).toBeUndefined();
  });

  test('should be backward compatible if foreground patch is an object', () => {
    patches.foregroundPatches = {
      patch: [{ op: 'replace', path: '/somepath', value: 'some value' }],
      resourceType: 'imports',
      resourceId: '999',
    };

    return expectSaga(saveProcessor, { id })
      .provide([
        [select(selectors.editorPatchSet, id), patches],
        [matchers.call.fn(commitStagedChanges), undefined],
      ])
      .not.put(actions.editor.saveFailed(id))
      .put(actions.editor.saveComplete(id))
      .run();
  });

  test('should not dispatch save complete action if ANY foregound patch fails', async () => {
    const { effects } = await expectSaga(saveProcessor, { id })
      .provide([
        [select(selectors.editorPatchSet, id), patches],
        [
          matchers.call(commitStagedChanges, {
            resourceType: 'imports',
            id: '999',
            scope: 'value',
          }),
          undefined,
        ],
        [
          call(commitStagedChanges, {
            resourceType: 'scripts',
            id: '777',
            scope: 'value',
          }),
          { error: 'some error' },
        ],
      ])
      .put(actions.editor.saveFailed(id))
      .not.put(actions.editor.saveComplete(id))
      .run();

    // 2nd call for 'scripts' patch will fail, hence the 3rd commit call should not happen
    expect(effects.call).toHaveLength(2);
  });

  test('should dispatch save complete action only if ALL foregound patches succeed', async () => {
    const { effects } = await expectSaga(saveProcessor, { id })
      .provide([
        [select(selectors.editorPatchSet, id), patches],
        [matchers.call.fn(commitStagedChanges), undefined],
      ])
      .not.put(actions.editor.saveFailed(id))
      .run();

    // since there are 3 foreground patches, total call to commitStagedChanges would be 3
    expect(effects.call).toHaveLength(3);
    expect(effects.put).toHaveLength(6);
    // 4th action would be editor savecomplete, after first 3 for foreground patchStaged
    expect(effects.put[3]).toEqual(put(actions.editor.saveComplete(id)));
  });

  test('should dispatch save complete action even if background patches fail', async () => {
    const { effects } = await expectSaga(saveProcessor, { id })
      .provide([
        [select(selectors.editorPatchSet, id), patches],
        [matchers.call.fn(commitStagedChanges), undefined],
        [
          call(commitStagedChanges, {
            resourceType: 'connections',
            id: '111',
            scope: 'value',
          }),
          { error: 'some error' },
        ],
      ])
      .not.put(actions.editor.saveFailed(id))
      .run();

    // since there are 3 foreground patches, total call to commitStagedChanges would be 3
    expect(effects.call).toHaveLength(3);

    // Note: if any effects' assertion(non-negated) is done while calling expectSaga API, then the returned Promise
    // contains that many less count of the effects
    // for eg, if we also add assertion in expectSaga like .put(actions.editor.saveComplete(id)), then effects.put
    // will have a length of 5, not 6 as we have already asserted one action
    expect(effects.put).toHaveLength(6);
    expect(effects.put[5]).toEqual(
      put(actions.resource.commitStaged('connections', '111', 'value'))
    );
  });

  describe('previewOnSave true', () => {
    const editor = { previewOnSave: true };

    test('should call evaluate processor and fail in case preview fails', () =>
      expectSaga(saveProcessor, { id })
        .provide([
          [select(selectors.editor, id), editor],
          [select(selectors.editorPatchSet, id), {}],
          [matchers.call.fn(evaluateProcessor), { error: 'some error' }],
        ])
        .call.fn(evaluateProcessor)
        .put(actions.editor.saveFailed(id))
        .run());

    test('should call evaluate processor and not fail the preview when no error', () =>
      expectSaga(saveProcessor, { id })
        .provide([
          [select(selectors.editor, id), editor],
          [select(selectors.editorPatchSet, id), {}],
          [matchers.call.fn(evaluateProcessor), {}],
        ])
        .call.fn(evaluateProcessor)
        .not.put(actions.editor.saveFailed(id))
        .run());
  });

  describe('previewOnSave false', () => {
    test('should not call evaluate processor for preview', () =>
      expectSaga(saveProcessor, { id })
        .provide([
          [select(selectors.editor, id), {}],
          [select(selectors.editorPatchSet, id), {}],
        ])
        .not.call.fn(evaluateProcessor)
        .run());
  });
});

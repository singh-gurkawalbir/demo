/* global describe, test, expect, jest */
import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { resourceConflictResolution, constructResourceFromFormValues } from './index';
import { createFormValuesPatchSet } from '../resourceForm';
import { selectors } from '../../reducers';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';

jest.mock('../../forms/formFactory/getResourceFromAssets');

// fake the return value of getResourceFormAssets when createFormValuesPatchSet calls this fn
getResourceFormAssets.mockReturnValue({fieldMap: {field1: {fieldId: 'something'}}, preSave: null});

describe('resourceConflictResolution', () => {
  /*
    Some background to these test cases:

    master: this refers to the local unaltered copy of a record
    origin: this refers to the latest copy of that record from the server
    merged: this refers to local changes on top of master

    */

  const master = {
    a: '1',
    b: '2',
    lastModified: 12,
  };
  const alteredMerged = {
    a: '1',
    b: '3',
    lastModified: 12,
  };
  const unalteredOrigin = {
    a: '1',
    b: '2',
    lastModified: 14,
  };
  const alteredOrigin = {
    a: '0',
    b: '2',
    lastModified: 14,
  };

  test('should return no conflict when master and origin hasn`t changed', () => {
    const result = resourceConflictResolution({
      merged: alteredMerged,
      master,
      origin: master,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredMerged,
    });
  });

  test('should return no conflict and return staged changes(TODO:ask Dave if correct), when master and origin has changed but their mutual values are identical', () => {
    const result = resourceConflictResolution({
      merged: alteredMerged,
      master,
      origin: unalteredOrigin,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredMerged,
    });
  });

  test('should return no conflict and return origin when they are no staged changes', () => {
    const result = resourceConflictResolution({
      master,
      merged: master,
      origin: alteredOrigin,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredOrigin,
    });
  });

  describe('when mutual properties of merged and origin has changed', () => {
    const master = {
      a: '1',
      b: '2',

      lastModified: 12,
    };
    const alteredMerged = {
      a: '1',
      b: '3',
      d: '7',
      lastModified: 12,
    };
    const alteredOrigin = {
      a: '2',
      b: '2',
      c: '4',
      lastModified: 14,
    };
    const unresolvableMerged = {
      a: '4',
      b: '3',
      lastModified: 12,
    };
    const unresolvableMergedWithDelete = {
      b: '3',
      lastModified: 12,
    };

    test('should return no conflict with merged incorporating staged changes over origin changes, when master and origin has changed', () => {
      const result = resourceConflictResolution({
        master,
        merged: alteredMerged,
        origin: alteredOrigin,
      });
      const resolvedMerged = {
        a: '2',
        b: '3',
        c: '4',
        d: '7',
        lastModified: 14,
      };

      // i apply automatic resolution when staged and master hasn't changed..then i incorporate origin changes

      expect(result).toEqual({
        conflict: null,

        merged: resolvedMerged,
      });
    });
    test('should return a conflict when master and origin has changes which are unresolvable', () => {
      const result = resourceConflictResolution({
        master,
        merged: unresolvableMerged,
        origin: alteredOrigin,
      });
      // in this case staged has changes....and i cannot apply any automatic resolution changes ..since i have staged some changes which are completely different
      const conflictPatches = [{ op: 'replace', path: '/a', value: '4' }];

      expect(result).toEqual({
        conflict: conflictPatches,
        merged: null,
      });
    });
    test('should return a conflict when master and origin has changes which are unresolvable and they are delete attempts', () => {
      const result = resourceConflictResolution({
        master,
        merged: unresolvableMergedWithDelete,
        origin: alteredOrigin,
      });
      const conflictPatches = [{ op: 'remove', path: '/a' }];

      expect(result).toEqual({
        conflict: conflictPatches,
        merged: null,
      });
    });
  });
});

describe('constructResourceFromFormValues saga', () => {
  test('should call createFormValuesPatchSet to get resource patchSet', () => {
    const resourceId = '123';
    const resourceType = 'imports';
    const formValues = [];

    return expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .call.fn(createFormValuesPatchSet)
      .run();
  });

  test('should return combined document if resource has active patch set', () => {
    const resourceId = '123';
    const resourceType = 'imports';
    const formValues = [];
    const merged = {
      description: 'abc',
    };
    const patchSet = [
      {
        op: 'add',
        path: '/patchKey',
        value: 'patchValue',
      },
    ];

    const expectedOutput = {
      description: 'abc',
      patchKey: 'patchValue',
    };

    return expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .provide([
        [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
      ])
      .returns(expectedOutput)
      .run();
  });

  test('should return empty object if invalid patchSet or resource is passed', () => {
    const resourceId = '123';
    const resourceType = 'imports';
    const formValues = [];
    const merged = {
      description: 'abc',
    };
    const patchSet = [
      {
        op: 'invalid',
        path: '/patchKey',
        value: 'patchValue',
      },
    ];

    return expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .provide([
        [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
      ])
      .returns({})
      .run();
  });

  test('should return empty object if resource id is undefined', () => {
    const resourceType = 'imports';
    const formValues = [];

    return expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceType,
    })
      .returns({})
      .run();
  });
});

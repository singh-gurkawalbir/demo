/* global describe, test, expect */
import { resourceConflictResolution } from './index';

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

  describe('for mutual properties of merged and origin has changed', () => {
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

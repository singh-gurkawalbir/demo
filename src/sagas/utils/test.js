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

  test('should return no conflict when master and origin hasn`t changed ', () => {
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

  test('should return no conflict when master and origin has changed but their mutual values remain the same', () => {
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

  test('should return no conflict but merged should incorporate changes from origin for only properties that haven`t changed from master to merged', () => {
    const result = resourceConflictResolution({
      master,
      merged: master,
      origin: alteredOrigin,
    });
    const resolvedMerged = {
      a: '0',
      b: '2',
      lastModified: 12,
    };

    expect(result).toEqual({
      conflict: null,

      merged: resolvedMerged,
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
      lastModified: 12,
    };
    const alteredOrigin = {
      a: '2',
      b: '2',
      lastModified: 14,
    };
    const unresolvableMerged = {
      a: '4',
      b: '3',
      lastModified: 12,
    };

    test('should return no conflict with merged incorporating resolvable origin changes when master and origin has changed', () => {
      const result = resourceConflictResolution({
        master,
        merged: alteredMerged,
        origin: alteredOrigin,
      });
      const resolvedMerged = {
        a: '2',
        b: '3',
        lastModified: 12,
      };

      // i apply automatic resolution when staged and master hasn't changed..then i incorporate origin changes

      expect(result).toEqual({
        conflict: null,

        merged: resolvedMerged,
      });
    });
    test('should return a conflict with merged incorporating resolvable origin changes when master and origin has changes which are unresolvable', () => {
      const result = resourceConflictResolution({
        master,
        merged: unresolvableMerged,
        origin: alteredOrigin,
      });
      // in this case origin has changes....and i cannot apply any automatic resolution changes ..since i have staged some changes which are completely different
      const resolvedMerged = {
        a: '4',
        b: '3',
        lastModified: 12,
      };
      const conflictPatches = [{ op: 'replace', path: '/a', value: '2' }];

      expect(result).toEqual({
        conflict: conflictPatches,
        merged: resolvedMerged,
      });
    });
  });
});

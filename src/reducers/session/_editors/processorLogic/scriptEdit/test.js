/* global describe, test, expect */

import processorLogic from './index';

const {
  patchSet,
} = processorLogic;

describe('scriptEdit processor logic', () => {
  describe('patchSet util', () => {
    test('should return the foregroundPatches containing /content path', () => {
      const editor = {
        id: 'script-123',
        stage: 'hook',
        flowId: 'flow-123',
        resourceId: 'res-123',
        resourceType: 'imports',
        code: 'some content',
        scriptId: '3388383',
      };
      const expectedPatches = {
        foregroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: 'some content',
            },
          ],
          resourceType: 'scripts',
          resourceId: '3388383',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedPatches);
    });
  });
});

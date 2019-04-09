/* global describe, test, expect */
import jsonPatch from 'fast-json-patch';
import { getMissingPatchSet, sanitizePatchSet } from './utils';

describe('Form Utils', () => {
  describe('getMissingPatchSet', () => {
    test('should find missing node', () => {
      const master = { a: 123 };
      const paths = ['/b/c', '/a/e/f'];
      const patchResult = getMissingPatchSet(paths, master);

      expect(patchResult).toEqual([
        { op: 'add', path: '/b', value: { c: {} } },
        { op: 'add', path: '/a/e', value: { f: {} } },
      ]);
    });
  });

  describe('sanitizePatchSet', () => {
    test('result patch set should succeed in patching resource', () => {
      const resource = {
        html: {
          name: 'abc',
        },
      };
      const patchSet = [
        { op: 'replace', path: '/html/rateLimit/failValues', value: [] },
      ];
      const sanitized = sanitizePatchSet({ patchSet, resource });
      // console.log(sanitized);
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      // console.log(merged);
      expect(merged).toEqual({
        html: { name: 'abc', rateLimit: { failValues: [] } },
      });
    });
  });
});

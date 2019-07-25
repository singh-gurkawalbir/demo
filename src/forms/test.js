/* global describe, test, expect */
import jsonPatch from 'fast-json-patch';
import { getMissingPatchSet, sanitizePatchSet } from './utils';

describe('Form Utils', () => {
  describe('getMissingPatchSet', () => {
    test('should find missing node', () => {
      const resource = { a: 123 };
      const paths = ['/b/c', '/a/e/f'];
      const patchResult = getMissingPatchSet(paths, resource);

      expect(patchResult).toEqual([
        { op: 'add', path: '/b', value: { c: {} } },
        { op: 'add', path: '/a/e', value: { f: {} } },
      ]);
    });

    test('should create a patch to replace the parent node with an object if it`s a string', () => {
      const resource = { a: 123, encrypted: '****' };
      const paths = ['/encrypted/apikey'];
      const patchResult = getMissingPatchSet(paths, resource);

      expect(patchResult).toEqual([
        { op: 'add', path: '/encrypted', value: { apikey: {} } },
      ]);
    });
    // Here we are trying to replace a value it could be string
    test('should not create any patch if the supplied paths does not exceed the object path', () => {
      const resource = { a: 123, encrypted: { blah: '****' } };
      const paths = ['/encrypted/blah'];
      const patchResult = getMissingPatchSet(paths, resource);

      expect(patchResult).toEqual([]);
    });
  });

  describe('sanitizePatchSet', () => {
    test('result patch set should succeed in patching resource when initial patch is missing operations.', () => {
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

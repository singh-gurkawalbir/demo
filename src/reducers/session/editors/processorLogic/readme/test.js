/* global describe, test, expect */

import processorLogic from './index';

const {
  init,
  patchSet,
} = processorLogic;

describe('readme processor logic', () => {
  describe('init util', () => {
    test('should correctly return the empty rule if resource has no readme value', () => {
      const options = {
        editorType: 'readme',
        fieldId: '',
        resourceId: '123',
        resourceType: 'integrations',
      };
      const expectedOutput = {
        editorType: 'readme',
        fieldId: '',
        resourceId: '123',
        resourceType: 'integrations',
        rule: '',
      };

      expect(init({options, resource: {}})).toEqual(expectedOutput);
      expect(init({options})).toEqual(expectedOutput);
    });
    test('should correctly return the rule as resource readme value', () => {
      const options = {
        editorType: 'readme',
        fieldId: '',
        resourceId: '123',
        resourceType: 'integrations',
      };
      const expectedOutput = {
        editorType: 'readme',
        fieldId: '',
        resourceId: '123',
        resourceType: 'integrations',
        rule: '<b>Read me</b>',
      };

      expect(init({options, resource: {readme: '<b>Read me</b>'}})).toEqual(expectedOutput);
    });
  });
  describe('patchSet util', () => {
    test('should return the patch array with replace readme path', () => {
      const editor = {
        data: 'dummy data',
        editorType: 'readme',
        fieldId: '',
        lastValidData: 'dummy data',
        layout: 'readme',
        resourceId: '123',
        resourceType: 'integrations',
        rule: '<b>Read me here</b>',
        sampleDataStatus: 'received',
      };

      const expectedOutput = {
        foregroundPatches: [{
          patch: [
            {
              op: 'replace',
              path: '/readme',
              value: '<b>Read me here</b>',
            },
          ],
          resourceType: 'integrations',
          resourceId: '123',
        }],
      };

      expect(patchSet(editor)).toEqual(expectedOutput);
    });
  });
});

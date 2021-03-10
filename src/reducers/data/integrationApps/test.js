/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('integrationApps data reducer', () => {
  describe('integrationApps settings receivedCategoryMappings action', () => {
    test('should not throw exceptions for bad params', () => {
      const state = reducer(undefined, 'some action');

      expect(() => reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata())).not.toThrow();
      expect(() => reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata(null))).not.toThrow();
      expect(() => reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata(123))).not.toThrow();
    });

    test('should update the state correctly and should not affect other settings', () => {
      let state = {
        'flow-integration1': {
          uiAssistant: 'amazon',
          initData: {
            data: 'data',
          },
          mappings: {
            mappingId: {
              fields: [{}],
            },
          },
        },
      };

      state = reducer(state, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', {
        uiAssistant: 'walmart',
        response: [{
          operation: 'generatesMetaDatà',
          data: [{
            id: 'field',
            name: 'field name',
          }],
        }, {
          operation: 'mappingData',
          data: [{
            id: 'field_mapping',
            name: 'field name',
          }],
        }],
      }));
      expect(state).toEqual({
        'flow-integration': {
          filters: {
            attributes: {
              conditional: true,
              optional: true,
              preferred: true,
              required: true,
            },
            mappingFilter: 'mapped',
          },
          generatesMetadata: [
            undefined,
          ],
          response: [
            {
              data: [
                {
                  id: 'field',
                  name: 'field name',
                },
              ],
              operation: 'generatesMetaDatà',
            },
            {
              data: [
                {
                  id: 'field_mapping',
                  name: 'field name',
                },
              ],
              operation: 'mappingData',
            },
          ],
          uiAssistant: 'walmart',
        },
        'flow-integration1': {
          initData: {
            data: 'data',
          },
          mappings: {
            mappingId: {
              fields: [
                {},
              ],
            },
          },
          uiAssistant: 'amazon',
        },
      });
    });
  });
});

describe('integrationApps data selectors', () => {
  describe('integrationApps settings categoryRelationshipData selector', () => {
    test('should not throw exceptions for bad params', () => {
      const state = reducer({}, actions.integrationApp.settings.receivedCategoryMappingMetadata('integration', 'flow', {
        uiAssistant: 'walmart',
        response: [{
          operation: 'generatesMetaDatà',
          data: [{
            id: 'field',
            name: 'field name',
          }],
        }, {
          operation: 'mappingData',
          data: [{
            id: 'field_mapping',
            name: 'field name',
          }],
        }],
      }));

      expect(() => selectors.categoryRelationshipData(state)).not.toThrow();
      expect(() => selectors.categoryRelationshipData(state, null)).not.toThrow();
      expect(() => selectors.categoryRelationshipData(null)).not.toThrow();
      expect(() => selectors.categoryRelationshipData(123)).not.toThrow();
    });

    test('should return correct relationship data when valid params are sent', () => {
      const state = {
        'flow-integration': {
          filters: {
            attributes: {
              conditional: true,
              optional: true,
              preferred: true,
              required: true,
            },
            mappingFilter: 'mapped',
          },
          generatesMetadata: [
            undefined,
          ],
          response: [
            {
              data: {
                categoryRelationshipData: [{
                  id: 'category1',
                  name: 'Cateogry 1',
                }, {
                  id: 'category2',
                  name: 'Cateogry 2',
                }],
              },
              operation: 'generatesMetaData',
            },
            {
              data: [
                {
                  id: 'field_mapping',
                  name: 'field name',
                },
              ],
              operation: 'mappingData',
            },
          ],
          uiAssistant: 'walmart',
        },
        'flow-integration1': {
          initData: {
            data: 'data',
          },
          mappings: {
            mappingId: {
              fields: [
                {},
              ],
            },
          },
          uiAssistant: 'amazon',
        },
      };

      expect(selectors.categoryRelationshipData(state, 'integration', 'flow')).toEqual([{
        id: 'category1',
        name: 'Cateogry 1',
      }, {
        id: 'category2',
        name: 'Cateogry 2',
      }]);
    });
  });
});


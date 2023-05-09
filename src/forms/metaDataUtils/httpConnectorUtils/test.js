import {
  initializeHttpConnectorForm,
  initializeHttpForm,
  getAttachedCustomSettingsMetadata,
  getUpdatedFieldMetaWithCustomSettings,
  getUpdatedFormLayoutWithCustomSettings,
} from '.';

describe('http connector util test cases', () => {
  const csName = {
    id: 'csName',
    name: '/csName',
    defaultValue: 'csName',
  };
  const csDesc = { id: 'csDesc', name: '/csDesc'};
  const csType = { id: 'csType', name: '/csType'};

  const resourceMetadata = {
    fieldMap: {
      name: { id: 'name', name: '/name' },
      type: { id: 'type', name: '/type'},
    },
    layout: {
      containers: [{
        fields: ['name', 'type'],
      }],
    },
  };

  describe('initializeHttpConnectorForm util', () => {
    test('should return passed metadata if the resource has no settings form', () => {
      const fieldMeta = {};

      expect(initializeHttpConnectorForm(fieldMeta, {})).toBe(fieldMeta);
    });
    test('should return updated metadata with cs fields positioned based on displayAfter for an existing resource', () => {
      const csMetadata = {
        fieldMap: { csName: { ...csName, displayAfter: 'export.name' }, csDesc, csType },
        layout: {
          containers: [{
            fields: ['csName', 'csDesc', 'csType'],
          }],
        },
      };

      const resource = {
        _id: '1234567',
        settingsForm: {
          form: csMetadata,
        },
        settings: { csName: 'storeId'},
      };

      const finalMetadata = {
        fieldMap: {
          name: { id: 'name', name: '/name' },
          type: { id: 'type', name: '/type'},
          'settings.csName': {
            fieldId: 'settings.csName',
            displayAfter: 'name',
            id: 'settings.csName',
            name: '/settings/csName',
            defaultValue: resource.settings.csName,

          },
        },
        layout: {
          containers: [{
            fields: ['name', 'settings.csName', 'type'],
          }],
        },
      };

      expect(initializeHttpConnectorForm(resourceMetadata, resource, 'exports')).toEqual(finalMetadata);
    });
    test('should return metadata with cs fields as well as a cs container for remaining cs fields for a new resource', () => {
      const csMetadata = {
        fieldMap: { csName: { ...csName, displayAfter: 'export.name' }, csDesc, csType },
        layout: {
          containers: [{
            fields: ['csName', 'csDesc', 'csType'],
          }],
        },
      };

      const resource = {
        _id: 'new-1234',
        settingsForm: {
          form: csMetadata,
        },
        settings: { csName: 'storeId'},
      };

      const finalMetadata = {
        fieldMap: {
          name: { id: 'name', name: '/name' },
          type: { id: 'type', name: '/type'},
          'settings.csName': {
            fieldId: 'settings.csName',
            displayAfter: 'name',
            id: 'settings.csName',
            name: '/settings/csName',
            defaultValue: resource.settings.csName,
          },
          csDesc: {
            fieldId: 'csDesc',
            id: 'csDesc',
            name: '/settings/csDesc',
          },
          csType: {
            fieldId: 'csType',
            id: 'csType',
            name: '/settings/csType',
          },
        },
        layout: {
          containers: [{
            fields: ['name', 'settings.csName', 'type'],
          }, {
            collapsed: true,
            label: 'Custom settings',
            fields: ['csDesc', 'csType'],
          }],
        },
      };

      expect(initializeHttpConnectorForm(resourceMetadata, resource, 'exports')).toEqual(finalMetadata);
    });
  });
  describe('initializeHttpForm util', () => {
    test('should do nothing for an existing resource and return passed metadata', () => {
      const fieldMeta = {};
      const resource = {
        _id: '123456654',
        name: 'shopify export',
      };

      expect(initializeHttpForm(fieldMeta, resource)).toBe(fieldMeta);
    });
    test('should add cs container incase of a new resource with cs fields', () => {
      const csMetadata = {
        fieldMap: { csDesc, csType },
        layout: {
          containers: [{
            fields: ['csDesc', 'csType'],
          }],
        },
      };

      const resource = {
        _id: 'new-1234',
        settingsForm: {
          form: csMetadata,
        },
        settings: { csName: 'storeId'},
      };

      const finalMetadata = {
        fieldMap: {
          name: { id: 'name', name: '/name' },
          type: { id: 'type', name: '/type'},
          csDesc: {
            fieldId: 'csDesc',
            id: 'csDesc',
            name: '/settings/csDesc',
          },
          csType: {
            fieldId: 'csType',
            id: 'csType',
            name: '/settings/csType',
          },
        },
        layout: {
          containers: [{
            fields: ['name', 'type'],
          }, {
            collapsed: true,
            label: 'Custom settings',
            fields: ['csDesc', 'csType'],
          }],
        },
      };

      expect(initializeHttpForm(resourceMetadata, resource, 'exports')).toEqual(finalMetadata);
    });
    test('should not add cs container incase of a new resource when there are no custom settings for the resource', () => {
      const resource = { _id: 'new-1234', name: 'test http' };

      expect(initializeHttpForm(resourceMetadata, resource, 'exports')).toEqual(resourceMetadata);
    });
  });
  describe('getAttachedCustomSettingsMetadata util', () => {
    test('should return the passed metadata when there are no cs metadata fields', () => {
      const emptyCsMetadata = { fieldMap: {}, layout: { containers: [{ fields: []}]}};

      expect(getAttachedCustomSettingsMetadata(resourceMetadata, {})).toEqual(resourceMetadata);
      expect(getAttachedCustomSettingsMetadata(resourceMetadata, emptyCsMetadata)).toEqual(resourceMetadata);
    });
    test('should add cs container with cs fields constructed incase the cs metadata existing for the resource', () => {
      const csMetadata = {
        fieldMap: { csDesc, csType },
        layout: {
          containers: [{
            fields: ['csDesc', 'csType'],
          }],
        },
      };

      const settings = { csName: 'storeId'};

      const finalMetadata = {
        fieldMap: {
          name: { id: 'name', name: '/name' },
          type: { id: 'type', name: '/type'},
          csDesc: {
            fieldId: 'csDesc',
            id: 'csDesc',
            name: '/settings/csDesc',
          },
          csType: {
            fieldId: 'csType',
            id: 'csType',
            name: '/settings/csType',
          },
        },
        layout: {
          containers: [{
            fields: ['name', 'type'],
          }, {
            collapsed: true,
            label: 'Custom settings',
            fields: ['csDesc', 'csType'],
          }],
        },
      };

      expect(getAttachedCustomSettingsMetadata(resourceMetadata, csMetadata, settings)).toEqual(finalMetadata);
    });
  });
  describe('getUpdatedFieldMetaWithCustomSettings util', () => {
    test('should return the passed metadata when there are no cs metadata fields', () => {
      expect(getUpdatedFieldMetaWithCustomSettings(resourceMetadata, {}, {})).toEqual(resourceMetadata);
    });
    test('should add cs container with cs fields constructed incase the cs metadata existing for the resource', () => {
      const csMetadata = {
        fieldMap: { csName: { ...csName, displayAfter: 'name' }, csDesc, csType },
        layout: {
          containers: [{
            fields: ['csName', 'csDesc', 'csType'],
          }],
        },
      };

      const settings = { csName: 'storeId'};

      const finalMetadata = {
        fieldMap: {
          name: { id: 'name', name: '/name' },
          type: { id: 'type', name: '/type'},
          'settings.csName': {
            fieldId: 'settings.csName',
            displayAfter: 'name',
            id: 'settings.csName',
            name: '/settings/csName',
            defaultValue: settings.csName,

          },
        },
        layout: {
          containers: [{
            fields: ['name', 'settings.csName', 'type'],
          }],
        },
      };

      expect(getUpdatedFieldMetaWithCustomSettings(resourceMetadata, csMetadata, settings)).toEqual(finalMetadata);
    });
  });
  describe('getUpdatedFormLayoutWithCustomSettings util', () => {
    test('should do nothing incase of invalid props', () => {
      expect(getUpdatedFormLayoutWithCustomSettings({})).toEqual({});
      expect(getUpdatedFormLayoutWithCustomSettings({ containers: [{ fields: []}] })).toEqual({ containers: [{ fields: [] }] });
    });
    test('should return updated layout with the cs field added beside the formFieldId', () => {
      const layout = {
        containers: [{
          fields: ['name', 'csName', 'type'],
        }],
      };
      const expectedLayout = {
        containers: [{
          fields: ['name', 'settingsField', 'csName', 'type'],
        }],
      };

      expect(getUpdatedFormLayoutWithCustomSettings(layout, 'name', 'settingsField')).toEqual(expectedLayout);
    });
  });
});

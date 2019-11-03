import {
  getResourceSubTypeFromAdaptorType,
  adaptorTypeMap,
} from '../../../../utils/resource';

export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite_da.mapping') {
      const lookupField = fields.find(
        field => field.fieldId === 'netsuite_da.lookups'
      );

      return {
        lookupId: 'netsuite_da.lookups',
        lookups: lookupField && lookupField.value,
      };
    }

    if (fieldId === 'mapping') {
      const mappingField = fields.find(field => field.id === 'mapping');
      const options = {};

      switch (mappingField.resourceSubType) {
        case adaptorTypeMap.SalesforceImport: {
          const sObjectTypeField = fields.find(
            field => field.id === 'salesforce.sObjectType'
          );
          const lookupField = fields.find(
            field => field.fieldId === 'salesforce.lookups'
          );

          options.sObjectType = sObjectTypeField && sObjectTypeField.value;
          options.lookupId = 'salesforce.lookups';
          options.lookups = lookupField && lookupField.value;
          break;
        }

        case adaptorTypeMap.FTPImport:
        case adaptorTypeMap.AS2Import:
        case adaptorTypeMap.S3Import: {
          const lookupField = fields.find(
            field => field.fieldId === 'file.lookups'
          );

          options.lookupId = 'file.lookups';
          options.lookups = lookupField && lookupField.value;
          break;
        }

        case adaptorTypeMap.HTTPImport: {
          const lookupField = fields.find(
            field => field.fieldId === 'http.lookups'
          );

          options.lookupId = 'http.lookups';
          options.lookups = lookupField && lookupField.value;
          break;
        }

        case adaptorTypeMap.RESTImport: {
          const lookupField = fields.find(
            field => field.fieldId === 'rest.lookups'
          );

          options.lookupId = 'rest.lookups';
          options.lookups = lookupField && lookupField.value;
          break;
        }

        case adaptorTypeMap.WrapperImport: {
          const lookupField = fields.find(
            field => field.fieldId === 'wrapper.lookups'
          );

          options.lookupId = 'wrapper.lookups';
          options.lookups = lookupField && lookupField.value;
          break;
        }

        default:
      }

      return options;
    }
  },
  fieldMap: {
    oneToMany: { fieldId: 'oneToMany' },
    pathToMany: { fieldId: 'pathToMany' },
    'netsuite_da.mapping': {
      fieldId: 'netsuite_da.mapping',
      refreshOptionsOnChangesTo: ['netsuite_da.lookups'],
      visible: r => {
        const { type: resourceSubType } = getResourceSubTypeFromAdaptorType(
          r.adaptorType
        );

        return resourceSubType === adaptorTypeMap.NetSuiteDistributedImport;
      },
    },
    mapping: {
      fieldId: 'mapping',
      resourceSubType: r => {
        const { type: resourceSubType } = getResourceSubTypeFromAdaptorType(
          r.adaptorType
        );

        return resourceSubType;
      },
      visible: r => {
        const { type: resourceSubType } = getResourceSubTypeFromAdaptorType(
          r.adaptorType
        );

        return resourceSubType !== adaptorTypeMap.NetSuiteDistributedImport;
      },
      refreshOptionsOnChangesTo: r => {
        const { type: resourceSubType } = getResourceSubTypeFromAdaptorType(
          r.adaptorType
        );

        switch (resourceSubType) {
          case adaptorTypeMap.SalesforceImport:
            return ['salesforce.sObjectType', 'salesforce.lookups'];
          case adaptorTypeMap.FTPImport:
          case adaptorTypeMap.AS2Import:
          case adaptorTypeMap.S3Import:
            return ['file.lookups'];
          case adaptorTypeMap.WrapperImport:
            return ['wrapper.lookups'];
          case adaptorTypeMap.HTTPImport:
            return ['http.lookups'];
          case adaptorTypeMap.RESTImport:
            return ['rest.lookups'];
          default:
        }
      },
    },
  },
  layout: {
    fields: [
      // 'dataMapping',
      'oneToMany',
      'pathToMany',
      /* Uncomment below changes to show mapping option on import forms */
      // 'mapping',
      // 'netsuite_da.mapping',
    ],
  },
};

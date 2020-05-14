import applications from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';
import { RDBMS_TYPES } from '../../../utils/constants';
// import { importOptions } from '../../utils';
import { importFileProviderOptions } from '../../utils';

const visibleWhenHasApp = { field: 'application', isNot: [''] };

export default {
  init: meta => meta,
  preSave: ({
    importId,
    exportId,
    application,
    resourceType,
    apiType,
    ...rest
  }) => {
    // slight hack here... page generator forms can
    // select an existing resource. The /resourceId field is
    // used by the resource form code within the panel
    // component of the <ResourceDrawer> to properly
    // handle this special case.

    if (importId || exportId) {
      return { '/resourceId': importId || exportId };
    }

    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${appTypeToAdaptorType[app.type]}${
        ['importRecords', 'transferFiles'].indexOf(resourceType) >= 0
          ? 'Import'
          : 'Export'
      }`,
    };

    newValues['/resourceType'] = resourceType;

    if (newValues['/adaptorType'] === 'NetSuiteImport') {
      newValues['/adaptorType'] = 'NetSuiteDistributedImport';
    }

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    // On creation of a new page processor lookup,  isLookup is set true
    if (['lookupRecords', 'lookupFiles'].indexOf(resourceType) >= 0) {
      newValues['/isLookup'] = true;
    }

    return newValues;
  },
  fieldMap: {
    resourceType: {
      id: 'resourceType',
      name: 'resourceType',
      type: 'select',
      label: 'What would you like to do?',
      refreshOptionsOnChangesTo: ['application'],
      required: true,
      defaultValue: r => (r && r.resourceType) || 'importRecords',
      options: [
        {
          items: [
            { label: 'Import data into destination app', value: 'imports' },
            {
              label: 'Lookup additional data (per record)',
              value: 'exports',
            },
          ],
        },
      ],
      helpText:
        'These are the options available for the selected application.  If the application only supports one option, then the value will be pre-selected and read-only.',
    },
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      label: 'Application',
      refreshOptionsOnChangesTo: ['resourceType'],
      placeholder:
        'Choose application or start typing to browse 150+ applications',
      defaultValue: r => (r && r.application) || '',
      required: true,
    },

    existingImport: {
      id: 'importId',
      name: 'importId',
      type: 'selectflowresource',
      flowResourceType: 'pp',
      resourceType: 'imports',
      label: 'Would you like to use an existing import?',
      defaultValue: '',
      required: false,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application', 'connection', 'resourceType'],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'connection', isNot: [''] },
        { field: 'resourceType', is: ['importRecords', 'transferFiles'] },
      ],
    },

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectflowresource',
      flowResourceType: 'pp',
      resourceType: 'exports',
      label: 'Would you like to use an existing lookup?',
      defaultValue: '',
      required: false,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application', 'connection', 'resourceType'],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'connection', isNot: [''] },
        { field: 'resourceType', is: ['lookupRecords', 'lookupFiles'] },
      ],
    },

    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      resourceType: 'connections',
      label: 'Connection',
      defaultValue: r => (r && r._connectionId) || '',
      required: true,
      allowNew: true,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [visibleWhenHasApp],
    },
  },
  layout: {
    fields: [
      'application',
      'resourceType',
      'connection',
      'existingImport',
      'existingExport',
    ],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const connectionField = fields.find(field => field.id === 'connection');
    // const resourceTypeField = fields.find(field => field.id === 'resourceType');
    const adaptorTypeSuffix = fieldId === 'importId' ? 'Import' : 'Export';
    const app = appField
      ? applications.find(a => a.id === appField.value) || {}
      : {};
    const resourceTypeField = fields.find(field => field.id === 'resourceType');

    if (fieldId === 'resourceType') {
      let options = importFileProviderOptions[app.assistant || app.type];

      if (!options) {
        options = importFileProviderOptions.default || [];
      }

      resourceTypeField.value = options && options[0] && options[0].value;
      resourceTypeField.disabled = options && options.length === 1;
      resourceTypeField.defaultDisabled = options && options.length === 1;

      return [
        {
          items: options,
        },
      ];
    }

    if (fieldId === 'connection') {
      const expression = [];

      if (RDBMS_TYPES.includes(app.type)) {
        expression.push({ 'rdbms.type': app.type });
      } else {
        expression.push({ type: app.type });
      }

      expression.push({ _connectorId: { $exists: false } });

      if (app.assistant) {
        expression.push({ assistant: app.assistant });

        const andingExpressions = { $and: expression };

        return { filter: andingExpressions, appType: app.assistant };
      }

      const andingExpressions = { $and: expression };

      return { filter: andingExpressions, appType: app.type };
    }

    if (['importId', 'exportId'].includes(fieldId)) {
      const adaptorTypePrefix = appTypeToAdaptorType[app.type];

      if (!adaptorTypePrefix) return;
      const expression = [];
      let adaptorType = `${adaptorTypePrefix}${adaptorTypeSuffix}`;

      if (fieldId === 'exportId') {
        expression.push({ isLookup: true });
      }

      if (['rest', 'http', 'salesforce', 'netsuite'].indexOf(app.type) >= 0) {
        if (resourceTypeField.value === 'importRecords') {
          expression.push({ blobKeyPath: { $exists: false } });

          if (adaptorType === 'NetSuiteImport') {
            adaptorType = 'NetSuiteDistributedImport';
          }
        } else if (resourceTypeField.value === 'transferFiles') {
          expression.push({ blobKeyPath: { $exists: true } });
        } else if (resourceTypeField.value === 'lookupRecords') {
          expression.push({ type: { $ne: 'blob' } });
        } else if (resourceTypeField.value === 'lookupFiles') {
          expression.push({ type: 'blob' });
        }
      }

      expression.push({
        adaptorType,
      });

      if (connectionField.value) {
        expression.push({ _connectionId: connectionField.value });
      }

      if (app.assistant) {
        expression.push({ assistant: app.assistant });
      }

      expression.push({ _connectorId: { $exists: false } });
      const filter = { $and: expression };
      let importLabel = `Would you like to use an existing ${
        resourceTypeField.value === 'transferFiles' ? 'transfer' : 'import'
      }?`;

      if (fieldId === 'exportId') {
        importLabel = 'Would you like to use an existing lookup?';
      }

      return { filter, appType: app.type, label: importLabel };
    }

    // if (fieldId === 'application') {
    //   const resourceTypeField = fields.find(
    //     field => field.id === 'resourceType'
    //   );

    //   return {
    //     appType: resourceTypeField.value === 'exports' ? 'export' : 'import',
    //   };
    // }

    return null;
  },
};

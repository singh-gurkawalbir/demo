import applications from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';

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
        resourceType === 'exports' ? 'Export' : 'Import'
      }`,
    };

    if (newValues['/adaptorType'] === 'NetSuiteImport') {
      newValues['/adaptorType'] = 'NetSuiteDistributedImport';
    }

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    // On creation of a new page processor lookup,  isLookup is set true
    if (resourceType === 'exports') {
      newValues['/isLookup'] = true;
    }

    // console.log('presave values', newValues);

    return newValues;
  },
  fieldMap: {
    resourceType: {
      id: 'resourceType',
      name: 'resourceType',
      type: 'select',
      label: 'What would you like to do?',
      required: true,
      defaultValue: r => (r && r.resourceType) || 'imports',
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
        { field: 'resourceType', is: ['imports'] },
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
        { field: 'resourceType', is: ['exports'] },
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
      'resourceType',
      'application',
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

    if (fieldId === 'connection') {
      const expression = [];

      if (['mysql', 'postgresql', 'mssql'].includes(app.type)) {
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

      expression.push({
        adaptorType: `${adaptorTypePrefix}${adaptorTypeSuffix}`,
      });

      if (fieldId === 'exportId') {
        expression.push({ isLookup: true });
      }

      if (connectionField.value) {
        expression.push({ _connectionId: connectionField.value });
      }

      if (app.assistant) {
        expression.push({ assistant: app.assistant });
      }

      expression.push({ _connectorId: { $exists: false } });
      const filter = { $and: expression };

      return { filter, appType: app.type };
    }

    if (fieldId === 'application') {
      const resourceTypeField = fields.find(
        field => field.id === 'resourceType'
      );

      return {
        appType: resourceTypeField.value === 'exports' ? 'export' : 'import',
      };
    }

    return null;
  },
};

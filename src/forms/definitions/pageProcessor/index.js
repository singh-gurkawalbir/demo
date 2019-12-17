import applications from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';

const visibleWhenHasApp = { field: 'application', isNot: [''] };
const visibleWhenIsNew = { field: 'isNew', is: ['true'] };

export default {
  init: meta => meta,
  preSave: ({
    isNew,
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
    if (isNew === 'false') {
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
    if (isNew && resourceType === 'exports') {
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
      placeholder: 'Select application',
      defaultValue: r => (r && r.application) || '',
      required: true,
    },
    isNew: {
      id: 'isNew',
      name: 'isNew',
      type: 'radiogroup',
      // label: 'Build new or use existing?',
      defaultValue: 'true',
      options: [
        {
          items: [
            { label: 'New', value: 'true' },
            {
              label: 'Existing',
              value: 'false',
            },
          ],
        },
      ],
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
    },

    existingImport: {
      id: 'importId',
      name: 'importId',
      type: 'selectresource',
      resourceType: 'imports',
      label: 'Existing Import',
      defaultValue: '',
      required: true,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
        { field: 'isNew', is: ['false'] },
        { field: 'resourceType', is: ['imports'] },
      ],
    },

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectresource',
      resourceType: 'exports',
      label: 'Existing Lookup',
      defaultValue: '',
      required: true,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
        { field: 'isNew', is: ['false'] },
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
      visibleWhenAll: [visibleWhenHasApp, visibleWhenIsNew],
    },
    name: {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application', 'resourceType'],
      visibleWhenAll: [visibleWhenHasApp, visibleWhenIsNew],
    },
    description: {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhenAll: [visibleWhenHasApp, visibleWhenIsNew],
    },
  },
  layout: {
    fields: [
      'resourceType',
      'application',
      'isNew',
      'existingImport',
      'existingExport',
      'connection',
      'name',
      'description',
    ],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const resourceTypeField = fields.find(field => field.id === 'resourceType');
    let adaptorTypeSuffix = fieldId === 'importId' ? 'Import' : 'Export';
    const app = appField
      ? applications.find(a => a.id === appField.value) || {}
      : {};

    if (fieldId === 'name') {
      adaptorTypeSuffix =
        resourceTypeField && resourceTypeField.value === 'imports'
          ? 'Import'
          : 'Export';

      return `New ${app.name} ${adaptorTypeSuffix}`;
    }

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

      if (app.assistant) {
        expression.push({ assistant: app.assistant });
      }

      expression.push({ _connectorId: { $exists: false } });
      const filter = { $and: expression };

      return { filter, appType: app.type };
    }

    return null;
  },
};

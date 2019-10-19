import applications from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';

const visibleWhenHasApp = { field: 'application', isNot: [''] };
const visibleWhenIsNew = { field: 'isNew', is: ['true'] };

export default {
  init: meta => meta,
  preSave: ({ application, resourceType, ...rest }) => {
    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${appTypeToAdaptorType[app.type]}${
        resourceType === 'exports' ? 'Export' : 'Import'
      }`,
    };

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
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
      showOptionsHorizontally: true,
      // label: 'Build new or use existing?',
      defaultValue: 'true',
      options: [
        {
          items: [
            { label: 'Create new', value: 'true' },
            {
              label: 'Choose existing',
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
      refreshOptionsOnChangesTo: ['application'],
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
    const adaptorTypeSuffix = fieldId === 'importId' ? 'Import' : 'Export';
    const app = appField
      ? applications.find(a => a.id === appField.value) || {}
      : {};

    if (fieldId === 'name') {
      return `New ${app.name} ${adaptorTypeSuffix}`;
    }

    if (fieldId === 'connection') {
      const filter = { type: app.type };

      if (app.assistant) {
        filter.assistant = app.assistant;
      }

      return { filter };
    }

    // console.log('fieldId', fieldId);

    if (['importId', 'exportId'].includes(fieldId)) {
      const adaptorTypePrefix = appTypeToAdaptorType[app.type];

      if (!adaptorTypePrefix) return;

      const filter = {
        adaptorType: `${adaptorTypePrefix}${adaptorTypeSuffix}`,
      };

      if (app.assistant) {
        filter.assistant = app.assistant;
      }

      console.log(`filter:`, filter);

      return { filter };
    }

    return null;
  },
};

import applications, {
  getWebhookConnectors,
  getWebhookOnlyConnectors,
} from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';

const visibleWhenIsNew = { field: 'isNew', is: ['true'] };

export default {
  preSave: ({
    isNew,
    exportId,
    type,
    application,
    executionType,
    apiType,
    ...rest
  }) => {
    // slight hack here... page generator forms can
    // select an existing resource. The /resourceId field is
    // used by the resource form code within the panel
    // component of the <ResourceDrawer> to properly
    // handle this special case.
    if (isNew === 'false' && exportId) {
      return { '/resourceId': exportId };
    }

    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
    };

    if (type === 'webhook') {
      newValues['/type'] = 'webhook';
      newValues['/adaptorType'] = 'WebhookExport';
      newValues['/webhook/provider'] = application;
      delete newValues['/_connectionId'];
    } else {
      newValues['/adaptorType'] = `${appTypeToAdaptorType[app.type]}Export`;

      if (app.assistant) {
        newValues['/assistant'] = app.assistant;
      }
    }

    if (app.type === 'netsuite') {
      newValues['/netsuite/type'] =
        executionType === 'scheduled' ? apiType : executionType;
    }

    // console.log(app, newValues);

    return newValues;
  },
  fieldMap: {
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      placeholder: 'Select application',
      defaultValue: r => (r && r.application) || '',
      required: true,
    },
    type: {
      id: 'type',
      name: 'type',
      type: 'radiogroup',
      label: 'This application supports two options for exporting data',
      defaultValue: r => (r && r.type) || 'api',
      required: true,
      showOptionsHorizontally: true,
      options: [
        {
          items: [
            { label: 'API', value: 'api' },
            { label: 'Webhook', value: 'webhook' },
          ],
        },
      ],
      visibleWhen: [
        {
          field: 'application',
          is: getWebhookConnectors().map(connector => connector.id),
        },
      ],
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

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectresource',
      resourceType: 'exports',
      label: 'Existing Export',
      defaultValue: '',
      required: true,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen: [{ field: 'isNew', is: ['false'] }],
    },

    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      resourceType: 'connections',
      label: 'Connection',
      defaultValue: r => (r && r._connectionId) || '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
        visibleWhenIsNew,
        {
          field: 'application',
          isNot: [
            '',
            ...getWebhookOnlyConnectors().map(connector => connector.id),
          ],
        },
        { field: 'type', is: ['api'] },
      ],
      allowNew: true,
      allowEdit: true,
    },
    name: {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [visibleWhenIsNew, { field: 'application', isNot: [''] }],
    },
    description: {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhenAll: [visibleWhenIsNew, { field: 'application', isNot: [''] }],
    },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      visibleWhenAll: [
        visibleWhenIsNew,
        { field: 'application', is: ['netsuite'] },
      ],
      label: 'Output Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        const output = r && r.file && r.file.output;

        if (!output) return 'records';

        return output;
      },
    },
    'netsuite.id': {
      id: 'netsuite.id',
      type: 'text',
      label: 'id',
      required: true,
      visibleWhenAll: [
        visibleWhenIsNew,
        { field: 'application', is: ['netsuite'] },
        { field: 'outputMode', is: ['blob'] },
      ],
    },
    netsuiteExecutionType: {
      id: 'netsuite.execution.type',
      name: 'executionType',
      type: 'radiogroup',
      label: 'Execution Type',
      required: true,
      options: [
        {
          items: [
            { label: 'Real-time', value: 'distributed' },
            { label: 'Scheduled', value: 'scheduled' },
          ],
        },
      ],
      visibleWhenAll: [
        visibleWhenIsNew,
        { field: 'application', is: ['netsuite'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    netsuiteApiType: {
      id: 'netsuite.api.type',
      name: 'apiType',
      type: 'radiogroup',
      label: 'API Type',
      required: true,
      options: [
        {
          items: [
            { label: 'RESTlet (Recommended)', value: 'restlet' },
            { label: 'Web Services', value: 'search' },
          ],
        },
      ],
      visibleWhenAll: [
        visibleWhenIsNew,
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
  },
  layout: {
    fields: [
      'application',
      'type',
      'isNew',
      'existingExport',
      'connection',
      'name',
      'description',
      'outputMode',
      'netsuite.id',
      'netsuiteExecutionType',
      'netsuiteApiType',
    ],
  },

  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'name') {
      return `New ${app.name} Export`;
    }

    if (fieldId === 'connection') {
      const expression = [];

      if (['mysql', 'postgresql', 'mssql'].includes(app.type)) {
        expression.push({ 'rdbms.type': app.type });
      } else {
        expression.push({ type: app.type });
      }

      if (app.assistant) {
        expression.push({ assistant: app.assistant });
      }

      expression.push({ _connectorId: { $exists: false } });
      const filter = { $and: expression };

      return { filter, appType: app.type };
    }

    if (fieldId === 'exportId') {
      const adaptorTypePrefix = appTypeToAdaptorType[app.type];

      if (!adaptorTypePrefix) return;
      const expression = [];

      expression.push({
        adaptorType: `${adaptorTypePrefix}Export`,
      });

      if (app.assistant) {
        expression.push({ assistant: app.assistant });
      }

      expression.push({ _connectorId: { $exists: false } });
      const filter = { $and: expression };

      return { filter };
    }

    return null;
  },
};

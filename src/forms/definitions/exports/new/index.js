import applications, {
  getWebhookConnectors,
  getWebhookOnlyConnectors,
} from '../../../../constants/applications';
import { appTypeToAdaptorType } from '../../../../utils/resource';

export default {
  preSave: ({ type, application, executionType, apiType, ...rest }) => {
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
      validWhen: {
        isNot: { values: [''], message: 'Please select an application' },
      },
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
    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      resourceType: 'connections',
      label: 'Connection',
      defaultValue: r => (r && r._connectionId) || '',
      required: true,
      validWhen: {
        isNot: { values: [''], message: 'Please select a connection' },
      },
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
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
      visibleWhen: [{ field: 'application', isNot: [''] }],
    },
    description: {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhen: [{ field: 'application', isNot: [''] }],
    },
    'netsuite.execution.type': {
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
      visibleWhen: [{ field: 'application', is: ['netsuite'] }],
    },
    'netsuite.api.type': {
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
      visibleWhen: [{ field: 'netsuite.execution.type', is: ['scheduled'] }],
    },
  },
  layout: {
    fields: [
      'application',
      'type',
      'connection',
      'name',
      'description',
      'netsuite.execution.type',
      'netsuite.api.type',
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

    return null;
  },
};

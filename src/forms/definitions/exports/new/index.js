import applications from '../../../../constants/applications';

const appTypeToAdaptorType = {
  salesforce: 'Salesforce',
  mongodb: 'Mongodb',
  postgresql: 'RDBMS',
  mysql: 'RDBMS',
  mssql: 'RDBMS',
  netsuite: 'NetSuite',
  ftp: 'FTP',
  http: 'HTTP',
  rest: 'REST',
  s3: 'S3',
  wrapper: 'Wrapper',
  as2: 'AS2',
  webhook: 'Webhook',
};

export default {
  preSave: ({ application, executionType, apiType, ...rest }) => {
    const app = applications.find(a => a.id === application) || {};
    // TODO: Raghu, the below logic should move to a proper fn that uses a map.
    // This will only work for a select few adaptorTypes as others probably
    // dont follow the uppercase rule. we have a /utils/resource file that
    // should hold the map fn.
    const newValues = {
      ...rest,
      '/adaptorType': `${appTypeToAdaptorType[app.type]}Export`,
    };

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    if (app.type === 'netsuite') {
      newValues['/netsuite/type'] =
        executionType === 'scheduled' ? apiType : executionType;
    }

    return newValues;
  },
  fieldMap: {
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      placeholder: 'Select application',
      defaultValue: '',
      required: true,
    },
    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      resourceType: 'connections',
      label: 'Connection',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen: [{ id: 'hasApp', field: 'application', isNot: [''] }],
      allowNew: true,
    },
    name: {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen: [{ id: 'hasApp', field: 'application', isNot: [''] }],
    },
    description: {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhen: [{ id: 'hasApp', field: 'application', isNot: [''] }],
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
      label: 'Execution Type',
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
      let filter;

      if (['mysql', 'postgresql', 'mssql'].includes(app.type)) {
        filter = { rdbms: { type: app.type } };
      } else filter = { type: app.type };

      if (app.assistant) {
        filter.assistant = app.assistant;
      }

      return { filter };
    }

    return null;
  },
};

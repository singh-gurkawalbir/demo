import {applicationsList, applicationsPlaceHolderText} from '../../../../constants/applications';
import { RDBMS_TYPES, FILE_PROVIDER_ASSISTANTS } from '../../../../utils/constants';

const visibleWhen = [
  {
    id: 'hasApp',
    field: 'application',
    isNot: [''],
  },
];
const appTypeToAdaptorType = {
  salesforce: 'Salesforce',
  mongodb: 'Mongodb',
  postgresql: 'RDBMS',
  mysql: 'RDBMS',
  mssql: 'RDBMS',
  oracle: 'RDBMS',
  snowflake: 'RDBMS',
  netsuite: 'NetSuiteDistributed',
  ftp: 'FTP',
  http: 'HTTP',
  rest: 'REST',
  s3: 'S3',
  wrapper: 'Wrapper',
  as2: 'AS2',
  webhook: 'Webhook',
  dynamodb: 'Dynamodb',
};

export default {
  preSave: ({ application, ...rest }) => {
    const applications = applicationsList();

    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${appTypeToAdaptorType[app.type]}Import`,
    };

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }
    // If there is no assistant for the import, we need to show generic adaptor form
    // we are patching useTechAdaptorForm field to not to show default assistant form
    if (!app.import && app.assistant && !FILE_PROVIDER_ASSISTANTS.includes(app.assistant)) {
      newValues['/useTechAdaptorForm'] = true;
    }

    return newValues;
  },
  fieldMap: {
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      label: 'Application',
      appType: 'import',
      placeholder: applicationsPlaceHolderText(),
      defaultValue: '',
      required: true,
      validWhen: {
        isNot: { values: [''], message: 'Please select an application' },
      },
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
      visibleWhen,
      allowNew: true,
      allowEdit: true,
      validWhen: {
        isNot: { values: [''], message: 'Please select a connection' },
      },
    },
    name: {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen,
    },
    description: {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhen,
    },
  },
  layout: {
    fields: ['application', 'connection', 'name', 'description'],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const applications = applicationsList();
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'connection') {
      const expression = [];

      if (RDBMS_TYPES.includes(app.type)) {
        expression.push({ 'rdbms.type': app.type });
      } else if (app.type === 'rest') {
        expression.push({ $or: [{ 'http.useRestForm': true }, { type: 'rest' }] });
      } else if (app.type === 'http') {
        expression.push({ 'http.useRestForm': { $ne: true } });
        expression.push({ type: app.type });
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

    return null;
  },
};

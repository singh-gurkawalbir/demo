import {applicationsList, applicationsPlaceHolderText} from '../../../../constants/applications';
import { getFilterExpressionForAssistant } from '../../../../utils/connections';
import { RDBMS_TYPES, FILE_PROVIDER_ASSISTANTS } from '../../../../constants';
import { rdbmsAppTypeToSubType } from '../../../../utils/resource';

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
  bigquerydatawarehouse: 'RDBMS',
  redshiftdatawarehouse: 'RDBMS',
  netsuite: 'NetSuiteDistributed',
  ftp: 'FTP',
  http: 'HTTP',
  rest: 'REST',
  s3: 'S3',
  wrapper: 'Wrapper',
  as2: 'AS2',
  webhook: 'Webhook',
  dynamodb: 'Dynamodb',
  graph_ql: 'GraphQL',
};

export default {
  preSave: ({ application, ...rest }) => {
    const applications = applicationsList();

    const app = applications.find(a => a.id === application) || {};
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;

    const newValues = {
      ...rest,
      '/adaptorType': `${appTypeToAdaptorType[appType]}Import`,
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
      helpKey: 'application',
      isLoggable: true,
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
    type: 'box',
    containers: [
      {
        fields: ['application', 'connection', 'name', 'description'],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const applications = applicationsList();
    const app = applications.find(a => a.id === appField.value) || {};
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;

    if (fieldId === 'connection') {
      const expression = [];

      if (RDBMS_TYPES.includes(appType)) {
        expression.push({ 'rdbms.type': rdbmsAppTypeToSubType(app.type) });
      } else if (appType === 'rest') {
        expression.push({ $or: [{ 'http.formType': 'rest' }, { type: 'rest' }] });
      } else if (appType === 'graph_ql') {
        expression.push({ $or: [{ 'http.formType': 'graph_ql' }] });
      } else if (appType === 'http') {
        if (app._httpConnectorId) { expression.push({ 'http._httpConnectorId': app._httpConnectorId }); }
        expression.push({ 'http.formType': { $ne: 'rest' } });
        expression.push({ type: appType });
      } else {
        expression.push({ type: appType });
      }

      expression.push({ _connectorId: { $exists: false } });
      const andingExpressions = { $and: expression };

      if (app._httpConnectorId) {
        return { filter: andingExpressions, appType: app.id };
      }

      if (app.assistant) {
        return {
          filter: getFilterExpressionForAssistant(app.assistant, expression),
          appType: app.assistant,
        };
      }

      return { filter: andingExpressions, appType };
    }

    return null;
  },
};

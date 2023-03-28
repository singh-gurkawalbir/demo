import {applicationsList,
  getWebhookConnectors,
  getWebhookOnlyConnectors,
  applicationsPlaceHolderText,
} from '../../../../constants/applications';
import { appTypeToAdaptorType, rdbmsAppTypeToSubType } from '../../../../utils/resource';
import { RDBMS_TYPES, FILE_PROVIDER_ASSISTANTS } from '../../../../constants';
import {getFilterExpressionForAssistant} from '../../../../utils/connections';

export default {
  preSave: ({ type, application, executionType, apiType, ...rest }) => {
    const applications = applicationsList();
    const app = applications.find(a => a.id === application) || {};
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;

    const newValues = {
      ...rest,
    };

    if (app._httpConnectorId || application === 'webhook') {
      newValues['/webhook/provider'] = 'custom';
      newValues['/_httpConnectorId'] = app._httpConnectorId;
    }
    if (type === 'webhook' || (application !== 'webhook' && app.webhookOnly)) {
      newValues['/type'] = 'webhook';
      newValues['/adaptorType'] = 'WebhookExport';
      if (app._httpConnectorId || application === 'webhook') {
        newValues['/webhook/provider'] = 'custom';
        newValues['/_httpConnectorId'] = app._httpConnectorId;
      } else {
        newValues['/webhook/provider'] = (application === 'integratorio' ? 'integrator-extension' : application);
      }
      delete newValues['/_connectionId'];
    } else {
      newValues['/adaptorType'] = `${appTypeToAdaptorType[appType]}Export`;

      if (application === 'webhook') {
        newValues['/type'] = 'webhook';
        newValues['/webhook/provider'] = 'custom';
      }

      if (app.assistant) {
        newValues['/assistant'] = app.assistant;
      }

      // If there is no assistant for the export, we need to show generic adaptor form
      // we are patching useTechAdaptorForm field to not to show default assistant form
      if (!app.export && app.assistant && !FILE_PROVIDER_ASSISTANTS.includes(app.assistant)) {
        newValues['/useTechAdaptorForm'] = true;
      }
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
      appType: 'export',
      placeholder: applicationsPlaceHolderText(),
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
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: ['application', 'type', 'connection', 'name', 'description'],
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
        appType.indexOf('jdbc') > -1 ? expression.push({ 'jdbc.type': appType })
          : expression.push({ 'rdbms.type': rdbmsAppTypeToSubType(appType) });
      } else if (appType === 'rest') {
        expression.push({ $or: [{ 'http.formType': 'rest' }, { type: 'rest' }] });
      } else if (appType === 'graph_ql') {
        expression.push({ $or: [{ 'http.formType': 'graph_ql' }] });
      } else if (appType === 'http' || (appType === 'rest' && app?.isHTTP === true && app._httpConnectorId)) {
        if (app._httpConnectorId) {
          // get all possible applications with same type (global and local connectors)
          const apps = applications.filter(a => a.id === appField.value) || [];
          const allConnectorIds = [];

          // show all connections with same http connector legacyId
          apps.forEach(a => {
            if (a._httpConnectorId) allConnectorIds.push(a._httpConnectorId);
          });

          expression.push({ 'http._httpConnectorId': {$in: allConnectorIds} });
          expression.push({$or: [{ type: 'rest' }, { type: 'http' }]});
          expression.push({ isHTTP: { $ne: false } });
        } else {
          expression.push({ type: appType });
        }

        expression.push({ 'http.formType': { $ne: 'rest' } });
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

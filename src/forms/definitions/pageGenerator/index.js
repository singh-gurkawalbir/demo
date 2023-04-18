import {applicationsList,
  getWebhookConnectors,
  getWebhookOnlyConnectors,
  applicationsPlaceHolderText,
} from '../../../constants/applications';
import { appTypeToAdaptorType, rdbmsAppTypeToSubType } from '../../../utils/resource';
import { RDBMS_TYPES, FILE_PROVIDER_ASSISTANTS } from '../../../constants';
import {getFilterExpressionForAssistant} from '../../../utils/connections';

export default {
  preSave: ({
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
    if (exportId) {
      return { '/resourceId': exportId };
    }
    const applications = applicationsList();
    const app = applications.find(a => a.id === application) || {};
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;
    const newValues = {
      ...rest,
    };

    if (type === 'webhook' || (application !== 'webhook' && app.webhookOnly)) {
      newValues['/type'] = 'webhook';
      newValues['/resourceType'] = 'webhook';
      newValues['/adaptorType'] = 'WebhookExport';

      if (app._httpConnectorId || application === 'webhook') {
        newValues['/webhook/provider'] = 'custom';
        newValues['/_httpConnectorId'] = app._httpConnectorId;
      } else newValues['/webhook/provider'] = (application === 'integratorio' ? 'integrator-extension' : application);
      delete newValues['/_connectionId'];
    } else {
      newValues['/resourceType'] = type;

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
      if (app._httpConnectorId) {
        newValues['/isHttpConnector'] = true;
      }
    }

    return newValues;
  },
  fieldMap: {
    application: {
      id: 'application',
      label: 'Application',
      helpKey: 'application',
      name: 'application',
      type: 'selectapplication',
      isLoggable: true,
      appType: 'export',
      placeholder: applicationsPlaceHolderText(),
      defaultValue: r => {
        if (!r) return '';

        return r.rdbmsAppType || r.application || '';
      },
      required: true,
    },
    type: {
      id: 'type',
      name: 'type',
      type: 'selectresourcetype',
      mode: 'source',
      label: 'What would you like to do?',
      dataTest: 'exportType',
      required: true,
      defaultValue: '',
      placeholder: 'Please select',
      defaultOpen: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
        {
          field: 'application',
          isNot: [''],
        },
      ],
    },
    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      resourceType: 'connections',
      label: 'Connection',
      checkPermissions: true,
      defaultValue: r => (r && r._connectionId) || '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
        {
          field: 'application',
          isNot: [
            '',
            ...getWebhookOnlyConnectors().map(connector => connector.id),
          ],
        },
        { field: 'type', isNot: ['webhook', ''] },
      ],
      allowNew: true,
      allowEdit: true,
    },

    checkExistingExport: {
      id: 'checkExistingExport',
      name: 'checkExistingExport',
      type: 'existingCheckresource',
      required: false,
      flowResourceType: 'pg',
      resourceType: 'exports',
      label: 'Use existing Export',
      refreshOptionsOnChangesTo: [
        'application',
        'connection',
        'type',
      ],
      visibleWhenAll: [
        {
          field: 'application',
          isNot: [''],
        },
      ],
    },

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectflowresource',
      flowResourceType: 'pg',
      resourceType: 'exports',
      label: '',
      defaultValue: '',
      required: false,
      allowEdit: true,
      defaultOpen: true,
      refreshOptionsOnChangesTo: [
        'application',
        'connection',
        'type',
        'exportId',
      ],
      visibleWhenAll: [
        {
          field: 'application',
          isNot: [''],
        },
        { field: 'checkExistingExport', is: [true] },
      ],
    },
  },

  layout: {
    type: 'box',
    containers: [
      {
        fields: ['application', 'type', 'connection', 'checkExistingExport', 'existingExport'],
      },
    ],
  },

  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const applications = applicationsList();
    const app = applications.find(a => a.id === appField.value) || {};
    const connectionField = fields.find(field => field.id === 'connection');
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;

    if (fieldId === 'type') {
      return { selectedApplication: app };
    }

    if (fieldId === 'connection') {
      const expression = [];

      if (RDBMS_TYPES.includes(appType)) {
        appType.indexOf('jdbc') > -1 ? expression.push({ 'jdbc.type': appType })
          : expression.push({ 'rdbms.type': rdbmsAppTypeToSubType(appType) });
      } else if (appType === 'rest') {
        expression.push({ $or: [{ 'http.formType': 'rest' }, { type: 'rest' }] });
      } else if (appType === 'graph_ql') {
        expression.push({ 'http.formType': 'graph_ql' });
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

    if (fieldId === 'exportId' || fieldId === 'checkExistingExport') {
      const exportField = fields.find(field => field.id === 'exportId');
      const type = fields.find(field => field.id === 'type').value;
      const isWebhook =
        getWebhookOnlyConnectors()
          .map(connector => connector.id)
          .includes(appField.value) ||
        (type === 'webhook' &&
          getWebhookConnectors()
            .map(connector => connector.id)
            .includes(appField.value));
      const adaptorTypePrefix = appTypeToAdaptorType[appType];

      // Lookups are not shown in PG suggestions
      const expression = [{ isLookup: { $exists: false } }];

      if (!adaptorTypePrefix) return { filter: { $and: expression }};

      if (isWebhook) {
        if (appField.value === 'webhook') {
          expression.push({
            'webhook.provider': 'custom',
          });
        } else {
          expression.push({
            $or: [
              { 'webhook.provider': appField.value },
              { $and: [{ 'webhook.provider': 'custom' }, { 'webhook._httpConnectorId': app._httpConnectorId }] },
            ],
          });
        }
      } else {
        if (appType === 'rest') {
          expression.push({
            $or: [
              { adaptorType: 'RESTExport' },
              { $and: [{ adaptorType: 'HTTPExport' }, { 'http.formType': 'rest' }] },
            ],
          });
        } else if (appType === 'graph_ql') {
          expression.push(
            { $and: [{ adaptorType: 'HTTPExport' }, { 'http.formType': 'graph_ql' }] },
          );
        } else if (appType === 'http') {
          expression.push({
            adaptorType: `${adaptorTypePrefix}Export`,
          });
          expression.push({
            'http.formType': { $ne: 'rest' },
          });
        } else {
          expression.push({
            adaptorType: `${adaptorTypePrefix}Export`,
          });
        }

        if (app.assistant) {
          expression.push({ assistant: app.assistant });
        }

        if (connectionField.value) {
          expression.push({
            _connectionId: connectionField.value,
          });
        }
      }

      expression.push({ _connectorId: { $exists: false } });

      if (['netsuite', 'salesforce'].indexOf(appType) >= 0) {
        if (type === 'realtime') {
          expression.push({ type: 'distributed' });
        } else {
          expression.push({ type: { $ne: 'distributed' } });
        }
      }

      const visible = isWebhook || !!connectionField.value;
      const filter = { $and: expression };
      let label =
        isWebhook || type === 'realtime'
          ? 'Would you like to use an existing listener?'
          : exportField.label;

      if (type === 'transferFiles') {
        label = 'Would you like to use an existing transfer?';
      }

      return {
        filter,
        appType,
        visible,
        label,
      };
    }

    return null;
  },
};

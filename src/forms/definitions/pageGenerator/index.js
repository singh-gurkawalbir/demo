import applications, {
  getWebhookConnectors,
  getWebhookOnlyConnectors,
} from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';

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

    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
    };

    if (type === 'webhook' || (application !== 'webhook' && app.webhookOnly)) {
      newValues['/type'] = 'webhook';
      newValues['/adaptorType'] = 'WebhookExport';
      newValues['/webhook/provider'] = application;
      delete newValues['/_connectionId'];
    } else {
      newValues['/adaptorType'] = `${appTypeToAdaptorType[app.type]}Export`;

      if (application === 'webhook') {
        newValues['/type'] = 'webhook';
        newValues['/webhook/provider'] = 'custom';
      }

      if (app.assistant) {
        newValues['/assistant'] = app.assistant;
      }
    }

    return newValues;
  },
  fieldMap: {
    application: {
      id: 'application',
      label: 'Application',
      name: 'application',
      type: 'selectapplication',
      appType: 'export',
      placeholder:
        'Choose application or start typing to browse 150+ applications',
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

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectflowresource',
      flowResourceType: 'pg',
      resourceType: 'exports',
      label: 'Would you like to use an existing export?',
      defaultValue: '',
      required: false,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application', 'connection', 'type'],
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
        { field: 'type', is: ['api'] },
      ],
      allowNew: true,
      allowEdit: true,
    },
  },
  layout: {
    fields: ['application', 'type', 'connection', 'existingExport'],
  },

  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const app = applications.find(a => a.id === appField.value) || {};

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

    if (fieldId === 'exportId') {
      const connectionField = fields.find(field => field.id === 'connection');
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
      const adaptorTypePrefix = appTypeToAdaptorType[app.type];

      if (!adaptorTypePrefix) return;
      // Lookups are not shown in PG suggestions
      const expression = [{ isLookup: { $exists: false } }];

      if (isWebhook) {
        expression.push({
          'webhook.provider':
            appField.value === 'webhook' ? 'custom' : appField.value,
        });
      } else {
        expression.push({
          adaptorType: `${adaptorTypePrefix}Export`,
        });

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

      const visible = isWebhook || !!connectionField.value;
      const filter = { $and: expression };

      return {
        filter,
        appType: app.type,
        visible,
        label: isWebhook
          ? 'Would you like to use an existing listener?'
          : exportField.label,
      };
    }

    return null;
  },
};

import {applicationsList,
  getWebhookConnectors,
  getWebhookOnlyConnectors,
} from '../../../constants/applications';
import { appTypeToAdaptorType } from '../../../utils/resource';
import { RDBMS_TYPES } from '../../../utils/constants';

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
    const newValues = {
      ...rest,
    };

    if (type === 'webhook' || (application !== 'webhook' && app.webhookOnly)) {
      newValues['/type'] = 'webhook';
      newValues['/resourceType'] = 'webhook';
      newValues['/adaptorType'] = 'WebhookExport';

      if (application === 'webhook') {
        newValues['/webhook/provider'] = 'custom';
      } else newValues['/webhook/provider'] = application;
      delete newValues['/_connectionId'];
    } else {
      newValues['/resourceType'] = type;

      newValues['/adaptorType'] = `${appTypeToAdaptorType[app.type]}Export`;

      if (application === 'webhook') {
        newValues['/type'] = 'webhook';
        newValues['/webhook/provider'] = 'custom';
      }

      if (app.assistant) {
        newValues['/assistant'] = app.assistant;
      }
      // If there is no assistant for the export, we need to show generic adaptor form
      // we are patching useTechAdaptorForm field to not to show default assistant form
      if (!app.export && app.assistant) {
        newValues['/useTechAdaptorForm'] = true;
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
      required: true,
      defaultValue: '',
      placeholder: 'Please select',
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
      ],
    },
  },
  layout: {
    fields: ['application', 'type', 'connection', 'existingExport'],
  },

  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const applications = applicationsList();
    const app = applications.find(a => a.id === appField.value) || {};
    const connectionField = fields.find(field => field.id === 'connection');

    if (fieldId === 'type') {
      return { selectedApplication: app };
    }

    if (fieldId === 'connection') {
      const expression = [];

      if (RDBMS_TYPES.includes(app.type)) {
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

      if (['netsuite', 'salesforce'].indexOf(app.type) >= 0) {
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
        appType: app.type,
        visible,
        label,
      };
    }

    return null;
  },
};

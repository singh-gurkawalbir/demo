import {applicationsList, applicationsPlaceHolderText} from '../../../constants/applications';
import { appTypeToAdaptorType, rdbmsAppTypeToSubType } from '../../../utils/resource';
import { RDBMS_TYPES, FILE_PROVIDER_ASSISTANTS } from '../../../constants';
import {getFilterExpressionForAssistant} from '../../../utils/connections';

export default {
  init: meta => meta,
  preSave: ({
    importId,
    exportId,
    application,
    resourceType,
    apiType,
    ...rest
  }) => {
    // slight hack here... page generator forms can
    // select an existing resource. The /resourceId field is
    // used by the resource form code within the panel
    // component of the <ResourceDrawer> to properly
    // handle this special case.

    if (importId || exportId) {
      return { '/resourceId': importId || exportId };
    }
    const applications = applicationsList();
    const app = applications.find(a => a.id === application) || {};
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;

    const newValues = {
      ...rest,
      '/adaptorType': `${appTypeToAdaptorType[appType]}${
        ['importRecords', 'transferFiles'].indexOf(resourceType) >= 0
          ? 'Import'
          : 'Export'
      }`,
    };

    newValues['/resourceType'] = resourceType;

    if (newValues['/adaptorType'] === 'NetSuiteImport') {
      newValues['/adaptorType'] = 'NetSuiteDistributedImport';
    }

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    // On creation of a new page processor lookup,  isLookup is set true
    if (['lookupRecords', 'lookupFiles'].indexOf(resourceType) >= 0) {
      newValues['/isLookup'] = true;
    }

    // If there is no assistant for the import, we need to show generic adaptor form
    // we are patching useTechAdaptorForm field to not to show default assistant form
    if ((app.assistant || app._httpConnectorId) && !FILE_PROVIDER_ASSISTANTS.includes(app.assistant)) {
      if ((newValues['/isLookup'] && !app.export) || (!newValues['/isLookup'] && !app.import)) { newValues['/useTechAdaptorForm'] = true; }
    }
    if (app._httpConnectorId) {
      newValues['/isHttpConnector'] = true;
    }

    return newValues;
  },
  fieldMap: {
    resourceType: {
      id: 'resourceType',
      name: 'resourceType',
      type: 'selectresourcetype',
      mode: 'destination',
      dataTest: 'exportType',
      label: 'What would you like to do?',
      refreshOptionsOnChangesTo: ['application'],
      required: true,
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      placeholder: 'Please select',
    },
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      isLoggable: true,
      label: 'Application',
      refreshOptionsOnChangesTo: ['resourceType'],
      placeholder: applicationsPlaceHolderText(),
      defaultValue: r => {
        if (!r) return '';

        return r.rdbmsAppType || r.application || '';
      },
      required: true,
    },

    existingImport: {
      id: 'importId',
      name: 'importId',
      type: 'selectflowresource',
      flowResourceType: 'pp',
      resourceType: 'imports',
      label: 'Would you like to use an existing import?',
      defaultValue: '',
      required: false,
      allowEdit: true,
      refreshOptionsOnChangesTo: [
        'application',
        'connection',
        'resourceType',
        'importId',
      ],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'connection', isNot: [''] },
        { field: 'resourceType', is: ['importRecords', 'transferFiles'] },
      ],
    },

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectflowresource',
      flowResourceType: 'pp',
      resourceType: 'exports',
      label: 'Would you like to use an existing lookup?',
      defaultValue: '',
      required: false,
      allowEdit: true,
      refreshOptionsOnChangesTo: [
        'application',
        'connection',
        'resourceType',
        'exportId',
      ],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'connection', isNot: [''] },
        { field: 'resourceType', is: ['lookupRecords', 'lookupFiles'] },
      ],
    },

    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      checkPermissions: true,
      resourceType: 'connections',
      label: 'Connection',
      defaultValue: r => (r && r._connectionId) || '',
      required: true,
      allowNew: true,
      allowEdit: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'resourceType', isNot: [''] },
      ],
    },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: [
          'application',
          'resourceType',
          'connection',
          'existingImport',
          'existingExport',
        ],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const connectionField = fields.find(field => field.id === 'connection');
    const adaptorTypeSuffix = fieldId === 'importId' ? 'Import' : 'Export';
    const applications = applicationsList();
    const app = appField
      ? applications.find(a => a.id === appField.value) || {}
      : {};
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;

    const resourceTypeField = fields.find(field => field.id === 'resourceType');

    if (fieldId === 'resourceType') {
      return { selectedApplication: app };
    }

    if (fieldId === 'connection') {
      const expression = [];

      if (RDBMS_TYPES.includes(appType)) {
        expression.push({ 'rdbms.type': rdbmsAppTypeToSubType(appType) });
      } else if (appType === 'rest') {
        expression.push({ $or: [{ 'http.formType': 'rest' }, { type: 'rest' }] });
      } else if (appType === 'graph_ql') {
        expression.push({ 'http.formType': 'graph_ql' });
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

    if (['importId', 'exportId'].includes(fieldId)) {
      const adaptorTypePrefix = appTypeToAdaptorType[appType];

      if (!adaptorTypePrefix) return;
      const expression = [];
      let adaptorType = `${adaptorTypePrefix}${adaptorTypeSuffix}`;

      if (fieldId === 'exportId') {
        expression.push({ isLookup: true });
      }

      if (['rest', 'http', 'salesforce', 'netsuite'].indexOf(appType) >= 0) {
        if (resourceTypeField.value === 'importRecords') {
          expression.push({ blob: { $exists: false } });

          if (adaptorType === 'NetSuiteImport') {
            adaptorType = 'NetSuiteDistributedImport';
          }
        } else if (resourceTypeField.value === 'transferFiles') {
          expression.push({ blob: { $exists: true } });
        } else if (resourceTypeField.value === 'lookupRecords') {
          expression.push({ type: { $ne: 'blob' } });
        } else if (resourceTypeField.value === 'lookupFiles') {
          expression.push({ type: 'blob' });
        }
      }

      if (appType === 'rest') {
        expression.push({
          $or: [
            { adaptorType: `REST${adaptorTypeSuffix}` },
            { $and: [{ adaptorType: `HTTP${adaptorTypeSuffix}` }, { 'http.formType': 'rest' }] },
          ],
        });
      } else if (appType === 'graph_ql') {
        expression.push(
          { $and: [{ adaptorType: `HTTP${adaptorTypeSuffix}` }, { 'http.formType': 'graph_ql' }] },
        );
      } else if (appType === 'http') {
        expression.push({
          adaptorType,
        });
        expression.push({
          'http.formType': { $ne: 'rest' },
        });
      } else {
        expression.push({
          adaptorType,
        });
      }

      if (connectionField.value) {
        expression.push({ _connectionId: connectionField.value });
      }

      if (app.assistant) {
        expression.push({ assistant: app.assistant });
      }

      expression.push({ _connectorId: { $exists: false } });
      const filter = { $and: expression };
      let importLabel = `Would you like to use an existing ${
        resourceTypeField.value === 'transferFiles' ? 'transfer' : 'import'
      }?`;

      if (fieldId === 'exportId') {
        importLabel = 'Would you like to use an existing lookup?';
      }

      return { filter, appType, label: importLabel };
    }

    return null;
  },
};

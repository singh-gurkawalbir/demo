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
      alwaysOpen: true,
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      placeholder: 'Please select',
    },
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      isLoggable: true,
      label: 'Application',
      helpKey: 'application',
      refreshOptionsOnChangesTo: ['resourceType'],
      placeholder: applicationsPlaceHolderText(),
      defaultValue: r => {
        if (!r) return '';

        return r.rdbmsAppType || r.application || '';
      },
      required: true,
    },

    checkExistingImport: {
      id: 'checkExistingImport',
      name: 'checkExistingImport',
      label: 'Use existing Import',
      type: 'existingCheckBox',
      flowResourceType: 'pp',
      resourceType: 'imports',
      required: false,
      refreshOptionsOnChangesTo: [
        'application',
        'connection',
        'resourceType',
      ],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'connection', isNot: [''] },
        { field: 'resourceType', is: ['importRecords', 'transferFiles'] },
      ],
    },

    existingImport: {
      id: 'importId',
      name: 'importId',
      type: 'selectflowresource',
      flowResourceType: 'pp',
      resourceType: 'imports',
      label: '',
      defaultValue: '',
      required: false,
      allowEdit: true,
      alwaysOpen: true,
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
        { field: 'checkExistingImport', is: [true] },
      ],
    },

    checkExistingExport: {
      id: 'checkExistingExport',
      name: 'checkExistingExport',
      label: 'Use existing Export',
      flowResourceType: 'pp',
      resourceType: 'exports',
      type: 'existingCheckresource',
      required: false,
      refreshOptionsOnChangesTo: [
        'application',
        'connection',
        'resourceType',
      ],
      visibleWhenAll: [
        { field: 'application', isNot: [''] },
        { field: 'connection', isNot: [''] },
        { field: 'resourceType', is: ['lookupRecords', 'lookupFiles'] },
      ],
    },

    existingExport: {
      id: 'exportId',
      name: 'exportId',
      type: 'selectflowresource',
      flowResourceType: 'pp',
      resourceType: 'exports',
      label: '',
      defaultValue: '',
      required: false,
      allowEdit: true,
      alwaysOpen: true,
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
        { field: 'checkExistingExport', is: [true] },
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
          'checkExistingImport',
          'existingImport',
          'checkExistingExport',
          'existingExport',
        ],
      },
    ],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const connectionField = fields.find(field => field.id === 'connection');
    const adaptorTypeSuffix = fieldId === 'importId' || fieldId === 'checkExistingImport' ? 'Import' : 'Export';
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

    if (['importId', 'exportId', 'checkExistingExport', 'checkExistingImport'].includes(fieldId)) {
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

      const visible = !!connectionField.value;

      return { filter, appType, label: importLabel, visible };
    }

    return null;
  },
};

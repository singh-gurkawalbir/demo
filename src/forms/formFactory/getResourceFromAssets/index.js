import produce from 'immer';

import formMeta from '../../definitions';
import { isJsonString } from '../../../utils/string';
import { FILE_PROVIDER_ASSISTANTS, RDBMS_TYPES, REST_ASSISTANTS} from '../../../constants';
import { getAssistantFromResource, getResourceSubType, isNewId, rdbmsSubTypeToAppType } from '../../../utils/resource';
import { isLoopReturnsv2Connection, isAcumaticaEcommerceConnection, isMicrosoftBusinessCentralOdataConnection, isSapByDesignSoapConnection, shouldLoadAssistantFormForImports, shouldLoadAssistantFormForExports, isEbayFinanceConnection } from '../../../utils/assistant';
import {getHttpConnector} from '../../../constants/applications';

const getAllOptionsHandlerSubForms = (
  fieldMap,
  resourceType,
  optionsHandler
) => {
  fieldMap &&
      Object.keys(fieldMap).forEach(field => {
        const { formId } = fieldMap[field];

        if (formId) {
          const { optionsHandler: foundOptionsHandler, fieldMap } = formMeta[
            resourceType
          ].subForms[formId];

          if (foundOptionsHandler) optionsHandler.push(foundOptionsHandler);

          return getAllOptionsHandlerSubForms(
            fieldMap,
            resourceType,
            optionsHandler
          );
        }
      });
};
export const getAmalgamatedOptionsHandler = (meta, resourceType) => {
  if (!meta) return null;

  const { optionsHandler, fieldMap } = meta;
  const allOptionsHandler = optionsHandler ? [optionsHandler] : [];

  getAllOptionsHandlerSubForms(fieldMap, resourceType, allOptionsHandler);

  const amalgamatedOptionsHandler = (fieldId, fields) => {
    const finalRes =
        allOptionsHandler &&
        allOptionsHandler
          .map(indvOptionsHandler => {
            if (indvOptionsHandler) {
              const res = indvOptionsHandler(fieldId, fields);

              return res;
            }

            return null;
          })
          .reduce((acc, curr) => curr || acc, {});

    return finalRes;
  };

  return amalgamatedOptionsHandler;
};
const applyCustomSettings = ({
  fieldMap,
  layout,
  preSave,
  validationHandler,
}) => {
  const newLayout = produce(layout, draft => {
    if (draft && draft.containers && draft.containers.length > 0) {
      if (draft.type === 'column') {
        const firstContainer = draft.containers[0];

        if (firstContainer.containers && firstContainer.containers.length) {
          // HACK to ensure 'settings' is displayed at the end
          firstContainer.containers = [
            {
              type: firstContainer.type,
              containers: firstContainer.containers,
            },
            { fields: ['settings'] },
          ];
          delete firstContainer.type;
        } else {
          firstContainer.fields.push('settings');
        }
      } else if (draft.type === 'collapse') {
        draft.containers = [
          { type: draft.type, containers: draft.containers },
          { fields: ['settings'] },
        ];
        delete draft.type;
      }
    } else if (draft.fields) {
      draft.fields.push('settings');
    }
  });
  const newFieldMap = produce(fieldMap, draft => {
    if (draft) {
      draft.settings = { fieldId: 'settings' };
    }
  });
  const preSaveProxy = (values, resource, options) => {
    const newValues = preSave ? preSave(values, resource, options) : values;

    return produce(newValues, draft => {
      if (Object.hasOwnProperty.call(draft, '/settings')) {
        let settings = draft['/settings'];

        if (isJsonString(settings)) {
          settings = JSON.parse(settings);
        } else if (typeof settings !== 'object') {
          settings = {};
        }

        draft['/settings'] = settings;
      }
    });
  };

  // TODO: this level of input specific validation should not be within the
  // formFactory.. this needs to be within the form meta (validWhen rules) or
  // just JS within the Dyna[Input] component mapped to manage the value.
  // This will be easiest after refactor of react-forms-processor to use redux.
  const validationHandlerProxy = field => {
    // Handles validity for settings field (when in string form)
    // Incase of other fields call the existing validationHandler
    if (field.id === 'settings') {
      if (
        field.value &&
          typeof field.value === 'string' &&
          !isJsonString(field.value)
      ) {
        return 'Settings must be a valid JSON';
      }
    }

    // Note that for this use-case, its assuming that a sub-form is managing error
    // messages per sub-form field. Thus this error message response is never made
    // visible and we just need to pass a truthy value to prevent the parent form
    // from submitting
    if (field.value?.__invalid) {
      return 'Sub-form invalid.';
    }

    if (validationHandler) return validationHandler(field);
  };

  return {
    fieldMap: newFieldMap,
    layout: newLayout,
    preSave: preSaveProxy,
    validationHandler: validationHandlerProxy,
  };
};

const getSuiteScriptFormMeta = ({resourceType, resource}) => {
  let meta;

  meta = formMeta.suiteScript[resourceType];

  if (resourceType === 'connections') {
    if (resource.type) {
      meta = meta[resource.type];
    }
  } else if (resourceType === 'exports') {
    const ssExport = resource.export;

    if (ssExport.netsuite && ssExport.netsuite.type) {
      meta = meta.netsuite[ssExport.netsuite.type];
    } else if (ssExport.type === 'salesforce') {
      if (ssExport.salesforce.type === 'sobject') {
        meta = meta.salesforce.realtime;
      } else {
        meta = meta.salesforce.scheduled;
      }
    } else {
      meta = meta[ssExport.type];
    }
  } else if (resourceType === 'imports') {
    const ssImport = resource.import;

    meta = meta[ssImport.type];
  }

  return meta;
};
const getFormMeta = ({resourceType, isNew, resource, connection, assistantData, accountOwner, parentConnectionId, applicationFieldState}) => {
  let meta;

  const { type } = getResourceSubType(resource);
  let isNewHTTPFramework = false;

  if (['exports', 'imports'].includes(resourceType) && connection?.http?.formType !== 'graph_ql') {
    isNewHTTPFramework = !!getHttpConnector(connection?.http?._httpConnectorId);
  } else if (resourceType === 'connections' && resource?.http?.formType !== 'graph_ql') {
    isNewHTTPFramework = !!getHttpConnector(resource?._httpConnectorId || resource?.http?._httpConnectorId);
  } else if (resourceType === 'iClients') {
    isNewHTTPFramework = 'true';
  }

  switch (resourceType) {
    case 'connections':
      if (isNew) {
        meta = formMeta.connections.new;
      } else if (isNewHTTPFramework) {
        if (resource?.http?.sessionFormType === 'http') {
          meta = formMeta.connections.http;
        } else {
          meta = formMeta.connections.httpFramework;
        }
      } else if (resource && resource.assistant === 'financialforce') {
        // Financial Force assistant is same as Salesforce. For more deatils refer https://celigo.atlassian.net/browse/IO-14279.

        meta = formMeta.connections.salesforce;
      } else if (resource && resource.assistant === 'authorize.net') {
        meta = formMeta.connections.custom.http['authorize.net'];
      } else if (resource && resource.assistant) {
        meta = formMeta.connections.custom[type];
        const assistant = getAssistantFromResource(resource);
        // eslint-disable-next-line no-undef
        const shopifyUserIds = SHOPIFY_USER_IDS?.split(',') || [];

        /* TODO This is a temp fix until React becomes the only app and when REST deprecation is done from backend
        perspective and when all assistant metadata files are moved over to HTTP adaptor */
        if (
          assistant &&
            REST_ASSISTANTS.includes(assistant)
        ) {
          meta = formMeta.connections.custom.http;
        }

        if (meta) {
          // @TODO to remove this changes after shopify approves the production app
          if (assistant === 'shopify' && !shopifyUserIds.includes(accountOwner?._id) && !resource?._connectorId) {
            meta = meta.shopifyOld;
          } else {
            meta = meta[assistant];
          }
        }
      } else if (resource && resource.type === 'jdbc') {
        const jdbcSubType = resource.jdbc.type;

        // when editing jdbc connection we lookup for the resource subtype
        meta = formMeta.connections.rdbms[jdbcSubType];
      } else if (resource && resource.type === 'rdbms') {
        const rdbmsSubType = resource.rdbms.type;

        // when editing rdms connection we lookup for the resource subtype
        meta = formMeta.connections.rdbms[rdbmsSubTypeToAppType(rdbmsSubType)];
      } else if (RDBMS_TYPES.includes(type)) {
        meta = formMeta.connections.rdbms[type];
      } else if (resource?.http?.formType === 'rest' && type === 'http') {
        meta = formMeta.connections.rest;
      } else if (type === 'graph_ql' || resource?.http?.formType === 'graph_ql') {
        meta = formMeta.connections.graphql;
      } else {
        meta = formMeta.connections[type];
      }

      break;

    case 'imports':
      meta = formMeta[resourceType];

      if (meta) {
        if (isNew) {
          meta = meta.new;
        } else if (isNewHTTPFramework) {
          const showAssistantView = assistantData?.import?.resources?.[0]?.operations?.length;

          if (!resource?.useParentForm && resource?.http?.sessionFormType !== 'http' && showAssistantView) {
            meta = meta.custom.httpFramework.assistantDefinition(
              resource._id,
              resource,
              assistantData
            );
          } else {
            meta = meta.http;
          }
        } else if (type === 'netsuite') {
          // get edit form meta branch
          meta = meta.netsuiteDistributed;
        } else if (
          type === 'salesforce' ||
            resource.assistant === 'financialforce'
        ) {
          // Financial Force assistant is same as Salesforce. For more deatils refer https://celigo.atlassian.net/browse/IO-14279.
          meta = meta.salesforce;
        } else if (type === 'rdbms') {
          const rdbmsSubType =
              connection && connection.rdbms && connection.rdbms.type;

          // when editing rdbms connection we lookup for the resource subtype
          if (rdbmsSubType === 'snowflake') {
            meta = meta.rdbms.snowflake;
          } else if (rdbmsSubType === 'bigquery') {
            meta = meta.rdbms.bigquerydatawarehouse;
          } else if (rdbmsSubType === 'redshift') {
            meta = meta.rdbms.redshiftdatawarehouse;
          } else {
            meta = meta.rdbms.sql;
          }
        } else if (FILE_PROVIDER_ASSISTANTS.includes(resource.assistant)) {
          // Common metadata for both the file providers googledrive and azurestorageaccount
          meta = meta.commonfileprovider;
        } else if (isLoopReturnsv2Connection(connection)) {
          meta = meta[type];
        } else if (isAcumaticaEcommerceConnection(connection)) {
          meta = meta[type];
        } else if (isEbayFinanceConnection(connection)) {
          meta = meta[type];
        } else if (isMicrosoftBusinessCentralOdataConnection(connection)) {
          meta = meta[type];
        } else if (isSapByDesignSoapConnection(connection)) {
          meta = meta[type];
        } else if (shouldLoadAssistantFormForImports(resource, connection)) {
          meta = meta.custom.http.assistantDefinition(
            resource._id,
            resource,
            assistantData
          );
        } else if (resource?.http?.formType === 'rest' && type === 'http') {
          meta = meta.rest;
        } else if (type === 'graph_ql' || resource?.http?.formType === 'graph_ql') {
          meta = resource.useParentForm ? meta.http : meta.graphql;
        } else {
          meta = meta[type];
        }
      }

      break;
    case 'exports':
      meta = formMeta[resourceType];

      if (meta) {
        if (isNew) {
          meta = meta.new;
        } else if (isNewHTTPFramework) {
          const showAssistantView = assistantData?.export?.resources?.[0]?.endpoints?.length;

          if (!resource?.useParentForm && resource?.http?.sessionFormType !== 'http' && showAssistantView) {
            meta = meta.custom.httpFramework.assistantDefinition(
              resource._id,
              resource,
              assistantData
            );
          } else {
            meta = meta.http;
          }
        } else if (isMicrosoftBusinessCentralOdataConnection(connection) || isSapByDesignSoapConnection(connection)) {
          if (type === 'http') {
            meta = meta[type];
          } else {
            meta = meta[type].json;
          }
        } else if (type === 'rdbms') {
          const rdbmsSubType =
              connection && connection.rdbms && connection.rdbms.type;

          // when editing rdms connection we lookup for the resource subtype
          if (rdbmsSubType === 'snowflake') {
            // TODO:both seems to be duplicated
            meta = meta.rdbms.snowflake;
          } else if (rdbmsSubType === 'bigquery') {
            meta = meta.rdbms.bigquerydatawarehouse;
          } else if (rdbmsSubType === 'redshift') {
            meta = meta.rdbms.redshiftdatawarehouse;
          } else {
            meta = meta.rdbms.sql;
          }
        } else if (type === 'jdbc') {
          const jdbcSubType =
              connection && connection.jdbc && connection.jdbc.type;

          // when editing rdms connection we lookup for the resource subtype
          if (jdbcSubType === 'netsuitejdbc') {
            meta = meta.rdbms.netsuitejdbc;
          }
        } else if (
          type === 'salesforce' ||
            resource.assistant === 'financialforce'
        ) {
          // Financial Force assistant is same as Salesforce. For more deatils refer https://celigo.atlassian.net/browse/IO-14279.
          meta = meta.salesforce;
        } else if (FILE_PROVIDER_ASSISTANTS.includes(resource.assistant)) {
          // Common metadata for both the file providers googledrive and azurestorageaccount
          meta = meta.commonfileprovider;
        } else if (shouldLoadAssistantFormForExports(resource, connection)) {
          meta = meta.custom.http.assistantDefinition(
            resource._id,
            resource,
            assistantData
          );
        } else if (type === 'rest' || (type === 'http' && resource?.http?.formType === 'rest')) {
          meta = meta.rest;

          if (connection?.http?.successMediaType === 'csv' || connection?.rest?.mediaType === 'csv') {
            meta = meta.csv;
          } else {
            meta = meta.json;
          }
        } else if (type === 'graph_ql' || resource?.http?.formType === 'graph_ql') {
          meta = resource.useParentForm ? meta.http : meta.graphql;
        } else {
          meta = meta[type];
        }
      }

      break;
    case 'connectorLicenses':
      meta = formMeta[resourceType];

      if (resource.type === 'integrationApp') {
        meta = meta.licenseTwoDotZero;
      } else if (resource.type === 'integrationAppChild') {
        meta = meta.childLicenseTwoDotZero;
      } else {
        meta = meta.licenseOneDotZero;
      }

      break;
    case 'iClients':
      meta = formMeta[resourceType];

      if (meta) {
        if (isNewHTTPFramework) {
          if (!resource?.assistant && !resource?.formType && !parentConnectionId) {
            // resource -> iclients
            meta = meta.iClient;
          } else if (resource?.formType === 'http' && (resource?.assistant || resource.application)) {
            // new iclient in connection
            meta = meta.iClient;
          } else if (resource?.formType === 'http' && (!resource?.assistant || !resource.application)) {
            // edit iclient in conn toggle to http
            meta = meta.iClient;
          } else if (resource?.assistant && !resource?.formType && !resource.application) {
            // new conn create iclient
            meta = meta.iClientHttpFramework;
          } else if (parentConnectionId && (applicationFieldState.value === 'HTTP' || applicationFieldState.value === 'REST API (HTTP)')) {
            // For HTTP and Rest Connection
            meta = meta.iClient;
          } else if (parentConnectionId && resource?.formType !== 'http' && (applicationFieldState.value === 'HTTP' || applicationFieldState.value === 'REST API (HTTP)')) {
            // connection after saving except HTTP and Rest connection
            meta = meta.iClientHttpFramework;
          } else {
            meta = meta.iClientHttpFramework;
          }
        }
      }
      break;

    case 'agents':
    case 'apis':
    case 'scripts':
    case 'accesstokens':
    case 'integrations':
    case 'stacks':
    case 'templates':
    case 'connectors':
    case 'asyncHelpers':
    case 'pageProcessor':
    case 'pageGenerator':
    case 'eventreports':
      meta = formMeta[resourceType];
      break;

    default:
      // TODO:is this necessary ghost code?
      meta = formMeta.default;
      break;
  }

  return meta;
};
const getResourceFormAssets = ({
  resourceType,
  resource,
  isNew = false,
  assistantData,
  connection,
  ssLinkedConnectionId,
  customFieldMeta,
  accountOwner,
  parentConnectionId,
  applicationFieldState,
}) => {
  let meta;

  // FormMeta generic pattern: fromMeta[resourceType][sub-type]
  // FormMeta custom pattern: fromMeta[resourceType].custom.[sub-type]

  try {
    if (ssLinkedConnectionId) {
      meta = getSuiteScriptFormMeta({resourceType, resource});
    } else {
      // TODO: @Siddharth, find better way to inject custom form field meta instead of directly applied from resourceFormInit
      meta = customFieldMeta || getFormMeta({resourceType, isNew, resource, connection, assistantData, accountOwner, parentConnectionId, applicationFieldState});
    }
  } catch (e) {
    throw new Error(`cannot load metadata assets ${resourceType} ${resource?._id}`);
  }
  if (!meta || !meta.fieldMap) { throw new Error(`cannot load metadata assets ${resourceType} resourceId:${resource?._id} assistant:${resource?.assistant}`); }

  let fieldMap;
  let layout = {};
  let preSave;
  let init;
  let actions;
  let validationHandler;

  if (meta) {
    ({ fieldMap, layout, preSave, init, actions } = meta);
  }
  const optionsHandler = getAmalgamatedOptionsHandler(meta, resourceType);

  // Need to be revisited @Surya
  validationHandler = meta && meta.validationHandler;
  const resourceTypesWithSettings = ['exports', 'imports', 'connections'];

  if (
    !isNewId(resource?._id) &&
      resourceTypesWithSettings.includes(resourceType) &&
      !ssLinkedConnectionId
  ) {
    ({ fieldMap, layout, preSave, validationHandler } = applyCustomSettings({
      fieldMap,
      validationHandler,
      layout,
      preSave,
    }));
  }

  return {
    fieldMeta: { fieldMap, layout, actions },
    init,
    preSave,
    optionsHandler,
    validationHandler,
  };
};

export default getResourceFormAssets;

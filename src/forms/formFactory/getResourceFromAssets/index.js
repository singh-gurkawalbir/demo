import produce from 'immer';

import formMeta from '../../definitions';
import { isJsonString } from '../../../utils/string';
import { RDBMS_TYPES, REST_ASSISTANTS } from '../../../utils/constants';
import { getResourceSubType } from '../../../utils/resource';

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

const getResourceFormAssets = ({
  resourceType,
  resource,
  isNew = false,
  assistantData,
  connection,
  ssLinkedConnectionId,
}) => {
  let fieldMap;
  let layout = {};
  let preSave;
  let init;
  let actions;
  let meta;
  let validationHandler;
  const { type } = getResourceSubType(resource);

  // FormMeta generic pattern: fromMeta[resourceType][sub-type]
  // FormMeta custom pattern: fromMeta[resourceType].custom.[sub-type]
  if (ssLinkedConnectionId) {
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

    if (meta) {
      ({ fieldMap, layout, preSave, init, actions } = meta);
    }
  } else {
    switch (resourceType) {
      case 'connections':
        if (isNew) {
          meta = formMeta.connections.new;
        } else if (resource && resource.assistant === 'financialforce') {
          // Financial Force assistant is same as Salesforce. For more deatils refer https://celigo.atlassian.net/browse/IO-14279.

          meta = formMeta.connections.salesforce;
        } else if (resource && resource.assistant) {
          meta = formMeta.connections.custom[type];

          /* TODO This is a temp fix until React becomes the only app and when REST deprecation is done from backend
          perspective and when all assistant metadata files are moved over to HTTP adaptor */
          if (
            resource.assistant &&
              REST_ASSISTANTS.indexOf(resource.assistant) > -1
          ) {
            meta = formMeta.connections.custom.http;
          }

          if (meta) {
            meta = meta[resource.assistant];
          }
        } else if (resource && resource.type === 'rdbms') {
          const rdbmsSubType = resource.rdbms.type;

          // when editing rdms connection we lookup for the resource subtype
          meta = formMeta.connections.rdbms[rdbmsSubType];
        } else if (RDBMS_TYPES.indexOf(type) !== -1) {
          meta = formMeta.connections.rdbms[type];
        } else {
          meta = formMeta.connections[type];
        }

        if (meta) {
          ({ fieldMap, layout, preSave, init, actions } = meta);
        }

        break;

      case 'imports':
        meta = formMeta[resourceType];

        if (meta) {
          if (isNew) {
            meta = meta.new;
          } else if (type === 'netsuite') {
            // get edit form meta branch
            meta = meta.netsuiteDistributed;
          } else if (
            type === 'salesforce' &&
              resource.assistant === 'financialforce'
          ) {
            // Financial Force assistant is same as Salesforce. For more deatils refer https://celigo.atlassian.net/browse/IO-14279.
            meta = meta.salesforce;
          } else if (type === 'rdbms') {
            const rdbmsSubType =
                connection && connection.rdbms && connection.rdbms.type;

            // when editing rdms connection we lookup for the resource subtype
            if (rdbmsSubType === 'snowflake') {
              meta = meta.rdbms.snowflake;
            } else {
              meta = meta.rdbms.sql;
            }
          } else if (
            resource &&
              (resource.useParentForm !== undefined
                ? !resource.useParentForm && resource.assistant
                : resource.assistant) && !resource.useTechAdaptorForm
          ) {
            meta = meta.custom.http.assistantDefinition(
              resource._id,
              resource,
              assistantData
            );
          } else {
            meta = meta[type];
          }

          if (meta) {
            ({ fieldMap, layout, init, preSave, actions } = meta);
          }
        }

        break;
      case 'exports':
        meta = formMeta[resourceType];

        if (meta) {
          if (isNew) {
            meta = meta.new;
          } else if (type === 'rdbms') {
            const rdbmsSubType =
                connection && connection.rdbms && connection.rdbms.type;

            // when editing rdms connection we lookup for the resource subtype
            if (rdbmsSubType === 'snowflake') {
              meta = meta.rdbms.snowflake;
            } else {
              meta = meta.rdbms.sql;
            }
          } else if (
            type === 'salesforce' &&
              resource.assistant === 'financialforce'
          ) {
            // Financial Force assistant is same as Salesforce. For more deatils refer https://celigo.atlassian.net/browse/IO-14279.

            meta = meta.salesforce;
          } else if (
            resource && resource.assistant !== 'openair' &&
              (resource.useParentForm !== undefined
                ? !resource.useParentForm && resource.assistant
                : resource.assistant) && !resource.useTechAdaptorForm
          ) {
            meta = meta.custom.http.assistantDefinition(
              resource._id,
              resource,
              assistantData
            );
          } else if (type === 'rest') {
            const { mediaType } = (connection && connection[type]) || {};

            meta = meta[type];

            if (mediaType === 'csv') {
              meta = meta.csv;
            } else {
              meta = meta.json;
            }
          } else {
            meta = meta[type];
          }

          if (meta) {
            ({ fieldMap, layout, init, preSave, actions } = meta);
          }
        }

        break;

      case 'agents':
      case 'apis':
      case 'scripts':
      case 'accesstokens':
      case 'connectorLicenses':
      case 'integrations':
        meta = formMeta[resourceType];
        ({ fieldMap, preSave, init, layout } = meta);
        break;
      case 'stacks':
      case 'templates':
      case 'connectors':
      case 'iClients':
      case 'asyncHelpers':
      case 'pageProcessor':
      case 'pageGenerator':
        meta = formMeta[resourceType];
        ({ fieldMap, layout, init, preSave, actions } = meta);
        break;

      default:
        meta = formMeta.default;
        break;
    }
  }

  const optionsHandler = getAmalgamatedOptionsHandler(meta, resourceType);

  // Need to be revisited @Surya
  validationHandler = meta && meta.validationHandler;
  const resourceTypesWithSettings = ['exports', 'imports', 'connections'];

  if (
    !isNew &&
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

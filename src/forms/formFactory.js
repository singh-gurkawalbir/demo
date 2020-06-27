import { get } from 'lodash';
import produce from 'immer';
import masterFieldHash from './fieldDefinitions';
import formMeta from './definitions';
import { getResourceSubType } from '../utils/resource';
import { REST_ASSISTANTS, RDBMS_TYPES } from '../utils/constants';
import { isJsonString } from '../utils/string';

const getAllOptionsHandlerSubForms = (
  fieldMap,
  resourceType,
  optionsHandler
) => {
  fieldMap &&
    Object.keys(fieldMap).forEach((field) => {
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
        .map((indvOptionsHandler) => {
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
  const newLayout = produce(layout, (draft) => {
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
  const newFieldMap = produce(fieldMap, (draft) => {
    if (draft) {
      draft.settings = { fieldId: 'settings' };
    }
  });
  const preSaveProxy = (values, resource) => {
    const newValues = preSave ? preSave(values, resource) : values;

    return produce(newValues, (draft) => {
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
  const validationHandlerProxy = (field) => {
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

      if (field.value && field.value.__invalid) {
        return 'Some of your settings are not valid.';
      }
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
              : resource.assistant)
          ) {
            meta = meta.custom.http.assistantDefinition(
              resource._id,
              resource,
              assistantData
            );
          } else {
            meta = meta[type];
          }

<<<<<<< HEAD
          if (meta) {
            ({ fieldMap, layout, init, preSave, actions } = meta);
=======
          meta = meta.salesforce;
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
        } else if (type === 'rest') {
          const { mediaType } = (connection && connection[type]) || {};

          meta = meta[type];

          if (mediaType === 'csv') {
            meta = meta.csv;
          } else {
            meta = meta.json;
>>>>>>> fc1978b00a750a4e42fb6ea2277342574386a693
          }
        }
<<<<<<< HEAD

        break;
      case 'exports':
        meta = formMeta[resourceType];

=======
>>>>>>> fc1978b00a750a4e42fb6ea2277342574386a693
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
            resource &&
            (resource.useParentForm !== undefined
              ? !resource.useParentForm && resource.assistant
              : resource.assistant)
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

const applyVisibilityRulesToSubForm = (f, resourceType) => {
  // subforms containers are not supported
  if (
    !formMeta[resourceType] ||
    !formMeta[resourceType].subForms ||
    !formMeta[resourceType].subForms[f.formId] ||
    !formMeta[resourceType].subForms[f.formId].fieldMap
  ) {
    throw new Error(`could not find fieldMap for given form id ${f.formId}`);
  }

  if (
    !formMeta[resourceType].subForms[f.formId].layout ||
    !formMeta[resourceType].subForms[f.formId].layout.fields
  ) {
    throw new Error(`could not find fields for given form id ${f.formId}`);
  }

  const fieldMapFromSubForm =
    formMeta[resourceType].subForms[f.formId].fieldMap;

  // todo: cannot support visibleWhen rule....there is no point propogating that rule
  if (f.visibleWhen && f.visibleWhenAll) {
    throw new Error(
      'Incorrect rule, cannot have both a visibleWhen and visibleWhenAll rule in the field view definitions'
    );
  }

  const transformedFieldMap = Object.keys(fieldMapFromSubForm)
    .map((key) => {
      let field = fieldMapFromSubForm[key];
      const masterFields = masterFieldHash[resourceType]
        ? masterFieldHash[resourceType][field.fieldId]
        : {};

      field = { ...masterFields, ...field };

      if (field.visibleWhen && field.visibleWhenAll) {
        throw new Error(
          'Incorrect rule, master fieldFields cannot have both a visibleWhen and visibleWhenAll rule'
        );
      }
      const fieldCopy = produce(field, (draft) => {
        if (f.visibleWhen) {
          draft.visibleWhen = draft.visibleWhen || [];
          draft.visibleWhen.push(...f.visibleWhen);
        } else if (f.visibleWhenAll) {
          draft.visibleWhenAll = draft.visibleWhenAll || [];

          draft.visibleWhenAll.push(...f.visibleWhenAll);
        }
      });

      return { field: fieldCopy, key };
    })
    .reduce((acc, curr) => {
      const { field, key } = curr;

      acc[key] = field;

      return acc;
    }, {});
  const subformFields = formMeta[resourceType].subForms[f.formId].layout.fields;

  return { subformFieldMap: transformedFieldMap, subformFields };
};

const applyingMissedOutFieldMetaProperties = (
  incompleteField,
  resource,
  resourceType,
  ignoreFunctionTransformations
) => {
  const field = incompleteField;

  if (!ignoreFunctionTransformations) {
    Object.keys(field).forEach((key) => {
      if (typeof field[key] === 'function') {
        field[key] = field[key](resource);
      }
    });
  }

  if (!field.id) {
    field.id = field.fieldId;
  }

  if (!field.name) {
    if (field.id) field.name = `/${field.id.replace(/\./g, '/')}`;
  }

  if (!Object.keys(field).includes('defaultValue')) {
    field.defaultValue = get(resource, field.id, '');
  }

  if (!field.helpText && !field.helpKey) {
    let singularResourceType = resourceType;

    // Make resourceType singular
    if (resourceType.charAt(resourceType.length - 1) === 's') {
      singularResourceType = resourceType.substring(0, resourceType.length - 1);
    }

    field.helpKey = `${singularResourceType}.${field.id}`;
  }

  if (!field.id || !field.name) {
    throw new Error(
      `Id and name must be provided for a field ${JSON.stringify(
        incompleteField
      )}`
    );
  }

  return field;
};

const flattenedFieldMap = (
  fields,
  fieldMap,
  resourceType,
  resource,
  opts = {}
) => {
  const {
    ignoreFunctionTransformations,
    developerMode,
    flowId,
    resObjectRefs = {},
    resFields = [],
  } = opts;

  fields &&
    fields.forEach((fieldReferenceName) => {
      const f = fieldMap[fieldReferenceName];

      if (f && f.formId) {
        const {
          subformFields,
          subformFieldMap,
        } = applyVisibilityRulesToSubForm(f, resourceType);

        resFields.push(...subformFields);

        return flattenedFieldMap(
          subformFields,
          subformFieldMap,
          resourceType,
          resource,
          {
            ignoreFunctionTransformations,
            developerMode,
            flowId,
            resObjectRefs,
          }
        );
      }

      const masterFields = masterFieldHash[resourceType]
        ? masterFieldHash[resourceType][f.fieldId]
        : {};
      const merged = {
        resourceId: resource._id,
        resourceType,
        flowId,
        ...masterFields,
        ...f,
      };
      const value = applyingMissedOutFieldMetaProperties(
        merged,
        resource,
        resourceType,
        ignoreFunctionTransformations
      );

      if (developerMode || !merged.developerModeOnly) {
        resFields.push(fieldReferenceName);
        // eslint-disable-next-line no-param-reassign
        resObjectRefs[fieldReferenceName] = value;
      }
    });

  return {
    fieldMap: resObjectRefs,
    fields: resFields,
  };
};

const setDefaultsToLayout = (
  layout,
  fieldMap,
  resourceType,
  resource,
  opts = {}
) => {
  const { fields, containers, ...rest } = layout;

  if (!fields && !containers) return null;

  const {
    fields: transformedFields,
    fieldMap: transformedFieldRef,
  } = flattenedFieldMap(fields, fieldMap, resourceType, resource, opts);
  let transformedFieldRefs = transformedFieldRef;
  const transformedContainers =
    containers &&
    containers.map((container) => {
      const {
        transformedLayout: transformedLayoutRes,
        transformedFieldMap: transfieldMap,
      } = setDefaultsToLayout(
        container,
        fieldMap,
        resourceType,
        resource,
        opts
      );
      const { fields, containers } = transformedLayoutRes;

      transformedFieldRefs = {
        ...transformedFieldRefs,
        ...transfieldMap,
      };

      return { ...container, fields, containers };
    });

  return {
    transformedLayout: {
      ...rest,
      ...(transformedFields && transformedFields.length > 0
        ? { fields: transformedFields }
        : {}),
      ...(transformedContainers && transformedContainers.length > 0
        ? { containers: transformedContainers }
        : {}),
    },
    transformedFieldMap: transformedFieldRefs,
  };
};

const getFieldsWithDefaults = (
  fieldMeta,
  resourceType,
  resource,
  opts = {}
) => {
  const { layout, fieldMap, actions } = fieldMeta;

  if (!layout || !fieldMap) {
    let str = !fieldMap ? 'fieldMap ' : '';

    str += !layout ? 'layout ' : '';

    throw new Error(`No ${str}in the metadata `);
  }

  const { transformedFieldMap, transformedLayout } = setDefaultsToLayout(
    layout,
    fieldMap,
    resourceType,
    resource,
    opts
  );

  return {
    layout: transformedLayout,
    fieldMap: transformedFieldMap,
    actions,
  };
};

const getFieldsWithoutFuncs = (meta, resource, resourceType) => {
  const transformedMeta = getFieldsWithDefaults(meta, resourceType, resource, {
    ignoreFunctionTransformations: true,
  });
  const { fieldMap: transformedFieldMap } = transformedMeta;
  const extractedInitFunctions = Object.keys(transformedFieldMap)
    .map((key) => {
      const field = transformedFieldMap[key];
      const fieldReferenceWithFunc = Object.keys(field)
        .filter((key) => typeof field[key] === 'function')
        .reduce((acc, key) => {
          if (field[key]) acc[key] = field[key];

          return acc;
        }, {});

      return { key, value: fieldReferenceWithFunc };
    })
    .filter((val) => Object.keys(val.value).length !== 0)
    .reduce((acc, curr) => {
      const { key, value } = curr;

      if (value) {
        acc[key] = value;
      }

      return acc;
    }, {});
  const transformedFieldMapWithoutFuncs = Object.keys(transformedFieldMap)
    .map((key) => {
      const field = transformedFieldMap[key];
      const fieldReferenceWithoutFunc = Object.keys(field)
        .filter((key) => typeof field[key] !== 'function')
        .reduce((acc, key) => {
          acc[key] = field[key];

          return acc;
        }, {});

      return { key, value: fieldReferenceWithoutFunc };
    })
    .reduce((acc, curr) => {
      const { key, value } = curr;

      acc[key] = value;

      return acc;
    }, {});

  return {
    ...transformedMeta,
    fieldMap: transformedFieldMapWithoutFuncs,
    extractedInitFunctions,
  };
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
  getFieldsWithoutFuncs,
};

import { get, cloneDeep } from 'lodash';
import masterFieldHash from '../forms/fieldDefinitions';
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
  isNew,
  validationHandler,
}) => {
  const fieldMapCopy = cloneDeep(fieldMap);
  const layoutCopy = cloneDeep(layout);
  let preSaveCopy = preSave;
  let validationHandlerCopy;

  if (!isNew) {
    if (
      layoutCopy &&
      layoutCopy.containers &&
      layoutCopy.containers.length > 0
    ) {
      if (layoutCopy.type === 'column') {
        if (
          layoutCopy.containers[0].containers &&
          layoutCopy.containers[0].containers.length
        )
          layoutCopy.containers[0].containers.push({
            collapsed: true,
            label: 'Custom settings',
            fields: ['settings'],
          });
        else {
          layoutCopy.containers[0].type = 'collapse';

          layoutCopy.containers[0].containers = [
            {
              collapsed: true,
              label: 'Custom settings',
              fields: ['settings'],
            },
          ];
        }
      } else
        layoutCopy.containers.push({
          collapsed: true,
          label: 'Custom settings',
          fields: ['settings'],
        });
    } else {
      layoutCopy.type = 'collapse';
      layoutCopy.containers = [
        {
          collapsed: true,
          label: 'Custom settings',
          fields: ['settings'],
        },
      ];
    }

    if (fieldMap) fieldMapCopy.settings = { fieldId: 'settings' };
    preSaveCopy = (args, resource) => {
      let retValues;

      if (preSave) {
        retValues = preSave(args, resource);
      } else {
        retValues = args;
      }

      if (Object.hasOwnProperty.call(retValues, '/settings')) {
        let settings = retValues['/settings'];

        if (isJsonString(settings)) {
          settings = JSON.parse(settings);
        } else {
          settings = {};
        }

        retValues['/settings'] = settings;
      }

      return retValues;
    };

    validationHandlerCopy = field => {
      // Handles validity for settings field
      // Incase of other fields call the existing validationHandler
      if (field.id === 'settings') {
        if (
          field.value &&
          typeof field.value === 'string' &&
          !isJsonString(field.value)
        )
          return 'Settings must be a valid JSON';
      }

      if (validationHandler) return validationHandler(field);
    };
  }

  return { fieldMapCopy, layoutCopy, preSaveCopy, validationHandlerCopy };
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
  let layout = [];
  let preSave;
  let init;
  let actions;
  let meta;
  let validationHandler;
  const { type } = getResourceSubType(resource);

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
    // FormMeta generic pattern: fromMeta[resourceType][sub-type]
    // FormMeta custom pattern: fromMeta[resourceType].custom.[sub-type]
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
          }

          // get edit form meta branch
          else if (type === 'netsuite') {
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
          } else if (RDBMS_TYPES.indexOf(type) !== -1) {
            meta = meta.rdbms;
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

  if (
    !ssLinkedConnectionId &&
    [
      'integrations',
      'exports',
      'imports',
      'pageProcessor',
      'pageGenerator',
      'connections',
    ].includes(resourceType)
  ) {
    ({
      fieldMapCopy: fieldMap,
      layoutCopy: layout,
      preSaveCopy: preSave,
      validationHandlerCopy: validationHandler,
    } = applyCustomSettings({
      fieldMap,
      validationHandler,
      layout,
      preSave,
      isNew,
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
  if (f.visibleWhen && f.visibleWhenAll)
    throw new Error(
      'Incorrect rule, cannot have both a visibleWhen and visibleWhenAll rule in the field view definitions'
    );

  const transformedFieldMap = Object.keys(fieldMapFromSubForm)
    .map(key => {
      let field = fieldMapFromSubForm[key];
      const masterFields = masterFieldHash[resourceType]
        ? masterFieldHash[resourceType][field.fieldId]
        : {};

      field = { ...masterFields, ...field };

      if (field.visibleWhen && field.visibleWhenAll)
        throw new Error(
          'Incorrect rule, master fieldFields cannot have both a visibleWhen and visibleWhenAll rule'
        );
      const fieldCopy = cloneDeep(field);

      if (f.visibleWhen) {
        fieldCopy.visibleWhen = fieldCopy.visibleWhen || [];
        fieldCopy.visibleWhen.push(...f.visibleWhen);
      } else if (f.visibleWhenAll) {
        fieldCopy.visibleWhenAll = fieldCopy.visibleWhenAll || [];

        fieldCopy.visibleWhenAll.push(...f.visibleWhenAll);
      }

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
    Object.keys(field).forEach(key => {
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

  if (!field.id || !field.name)
    throw new Error(
      `Id and name must be provided for a field ${JSON.stringify(
        incompleteField
      )}`
    );

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
    fields.forEach(fieldReferenceName => {
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

      window.debug_masterFieldHash = masterFieldHash;

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

      if (!developerMode) {
        if (!merged.showOnDeveloperMode) {
          resFields.push(fieldReferenceName);
          // eslint-disable-next-line no-param-reassign
          resObjectRefs[fieldReferenceName] = value;
        }
      } else {
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
    containers.map(container => {
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
    .map(key => {
      const field = transformedFieldMap[key];
      const fieldReferenceWithFunc = Object.keys(field)
        .filter(key => typeof field[key] === 'function')
        .reduce((acc, key) => {
          if (field[key]) acc[key] = field[key];

          return acc;
        }, {});

      return { key, value: fieldReferenceWithFunc };
    })
    .filter(val => Object.keys(val.value).length !== 0)
    .reduce((acc, curr) => {
      const { key, value } = curr;

      if (value) {
        acc[key] = value;
      }

      return acc;
    }, {});
  const transformedFieldMapWithoutFuncs = Object.keys(transformedFieldMap)
    .map(key => {
      const field = transformedFieldMap[key];
      const fieldReferenceWithoutFunc = Object.keys(field)
        .filter(key => typeof field[key] !== 'function')
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

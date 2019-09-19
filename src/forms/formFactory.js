import { deepClone } from 'fast-json-patch';
import { get } from 'lodash';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from './definitions';
import { getResourceSubType } from '../utils/resource';

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

        // Is it necessary to make a deepClone
        if (foundOptionsHandler)
          optionsHandler.push(deepClone(foundOptionsHandler));

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

const getResourceFormAssets = ({
  resourceType,
  resource,
  isNew = false,
  assistantData,
}) => {
  let fieldMap;
  let layout = [];
  let preSubmit;
  let init;
  let actions;
  let meta;
  const { type } = getResourceSubType(resource);

  // FormMeta generic pattern: fromMeta[resourceType][sub-type]
  // FormMeta custom pattern: fromMeta[resourceType].custom.[sub-type]
  switch (resourceType) {
    case 'connections':
      if (isNew) {
        meta = formMeta.connections.new;
      } else if (resource && resource.assistant) {
        meta = formMeta.connections.custom[type];

        if (meta) {
          meta = meta[resource.assistant];
        }
      } else if (resource && resource.type === 'rdbms') {
        const rdbmsSubType = resource.rdbms.type;

        // when editing rdms connection we lookup for the resource subtype
        meta = formMeta.connections.rdbms[rdbmsSubType];
      } else if (['mysql', 'postgresql', 'mssql'].indexOf(type) !== -1) {
        meta = formMeta.connections.rdbms[type];
      } else {
        meta = formMeta.connections[type];
      }

      if (meta) {
        ({ fieldMap, layout, preSubmit, init, actions } = meta);
      }

      break;

    case 'imports':
    case 'exports':
      meta = formMeta[resourceType];

      if (meta) {
        if (isNew) {
          meta = meta.new;
        }
        // get edit form meta branch
        else if (type === 'netsuite' && resourceType === 'exports') {
          meta = meta.netsuite[resource.netsuite.type];
        } else if (resource && resource.assistant) {
          meta = meta.custom.http.assistantDefinition(
            resource._id,
            resource,
            assistantData
          );
        } else {
          meta = meta[type];
        }

        if (meta) {
          ({ fieldMap, layout, init, preSubmit, actions } = meta);
        }
      }

      break;

    case 'agents':
    case 'scripts':
    case 'stacks':
      // TODO:check layout should be here
      meta = formMeta[resourceType];
      ({ fieldMap } = meta);

      break;

    default:
      meta = formMeta.default;
      break;
  }

  const optionsHandler = getAmalgamatedOptionsHandler(meta, resourceType);

  return {
    fieldMeta: { fieldMap, layout, actions },
    init,
    preSubmit,
    optionsHandler,
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
      const field = fieldMapFromSubForm[key];

      if (field.visibleWhen && field.visibleWhenAll)
        throw new Error(
          'Incorrect rule, master fieldFields cannot have both a visibleWhen and visibleWhenAll rule'
        );
      const fieldCopy = deepClone(field);

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
  const subFormFields = formMeta[resourceType].subForms[f.formId].layout.fields;

  return { subformfieldMap: transformedFieldMap, subFormFields };
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

const flattenedfieldMap = (
  fields,
  fieldMap,
  resourceType,
  resource,
  ignoreFunctionTransformations,
  resObjectRefs = {},
  resFields = []
) => {
  fields &&
    fields.forEach(fieldReferenceName => {
      const f = fieldMap[fieldReferenceName];

      if (f && f.formId) {
        const {
          subFormFields,
          subformfieldMap,
        } = applyVisibilityRulesToSubForm(f, resourceType);

        resFields.push(...subFormFields);

        return flattenedfieldMap(
          subFormFields,
          subformfieldMap,
          resourceType,
          resource,
          ignoreFunctionTransformations,
          resObjectRefs
        );
      }

      const masterFields = masterFieldHash[resourceType]
        ? masterFieldHash[resourceType][f.fieldId]
        : {};
      const merged = {
        resourceId: resource._id,
        resourceType,
        ...masterFields,
        ...f,
      };
      const value = applyingMissedOutFieldMetaProperties(
        merged,
        resource,
        resourceType,
        ignoreFunctionTransformations
      );

      resFields.push(fieldReferenceName);
      // eslint-disable-next-line no-param-reassign
      resObjectRefs[fieldReferenceName] = value;
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
  ignoreFunctionTransformations
) => {
  const { fields, containers, ...rest } = layout;

  if (!fields && !containers) return null;

  const {
    fields: transformedFields,
    fieldMap: transformedFieldRef,
  } = flattenedfieldMap(
    fields,
    fieldMap,
    resourceType,
    resource,
    ignoreFunctionTransformations
  );
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
        ignoreFunctionTransformations
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
  ignoreFunctionTransformations = false
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
    ignoreFunctionTransformations
  );

  return {
    layout: transformedLayout,
    fieldMap: transformedFieldMap,
    actions,
  };
};

const getFieldsWithoutFuncs = (meta, resource, resourceType) => {
  const transformedMeta = getFieldsWithDefaults(
    meta,
    resourceType,
    resource,
    true
  );
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

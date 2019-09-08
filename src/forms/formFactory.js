import { deepClone } from 'fast-json-patch';
import { get } from 'lodash';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from './definitions';
import { getResourceSubType } from '../utils/resource';

const getAllOptionsHandlerSubForms = (
  fieldReferences,
  resourceType,
  optionsHandler
) => {
  fieldReferences &&
    Object.keys(fieldReferences).forEach(field => {
      const { formId } = fieldReferences[field];

      if (formId) {
        const {
          optionsHandler: foundOptionsHandler,
          fieldReferences,
        } = formMeta[resourceType].subForms[formId];

        // Is it necessary to make a deepClone
        if (foundOptionsHandler)
          optionsHandler.push(deepClone(foundOptionsHandler));

        return getAllOptionsHandlerSubForms(
          fieldReferences,
          resourceType,
          optionsHandler
        );
      }
    });
};

export const getAmalgamatedOptionsHandler = (meta, resourceType) => {
  if (!meta) return null;

  const { optionsHandler, fieldReferences } = meta;
  const allOptionsHandler = optionsHandler ? [optionsHandler] : [];

  getAllOptionsHandlerSubForms(
    fieldReferences,
    resourceType,
    allOptionsHandler
  );

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

const getResourceFormAssets = ({ resourceType, resource, isNew = false }) => {
  let fieldReferences;
  let layout = [];
  let preSubmit;
  let init;
  let actions;
  let meta;
  const { type } = getResourceSubType(resource);

  // console.log('resource', resource);

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
      } else {
        meta = formMeta.connections[type];
      }

      if (meta) {
        ({ fieldReferences, layout, preSubmit, init, actions } = meta);
      }

      break;

    case 'imports':
    case 'exports':
      meta = formMeta[resourceType];
      // console.log('type', type);

      if (meta) {
        if (isNew) {
          meta = meta.new;
        }
        // get edit form meta branch
        else if (type === 'netsuite') {
          meta = meta.netsuite[resource.netsuite.type];
        } else {
          meta = meta[type];
        }

        if (meta) {
          ({ fieldReferences, layout, init, preSubmit, actions } = meta);
        }
      }

      break;

    case 'agents':
    case 'scripts':
    case 'stacks':
      // TODO:check layout should be here
      meta = formMeta[resourceType];
      ({ fieldReferences } = meta);

      break;

    default:
      meta = formMeta.default;
      break;
  }

  const optionsHandler = getAmalgamatedOptionsHandler(meta, resourceType);

  return {
    fieldMeta: { fieldReferences, layout, actions },
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
    !formMeta[resourceType].subForms[f.formId].fieldReferences
  ) {
    throw new Error(
      `could not find fieldReferences for given form id ${f.formId}`
    );
  }

  const fieldReferencesFromSubForm =
    formMeta[resourceType].subForms[f.formId].fieldReferences;

  // todo: cannot support visibleWhen rule....there is no point propogating that rule
  if (f.visibleWhen && f.visibleWhenAll)
    throw new Error(
      'Incorrect rule, cannot have both a visibleWhen and visibleWhenAll rule in the field view definitions'
    );

  const transformedFieldReferences = Object.keys(fieldReferencesFromSubForm)
    .map(key => {
      const field = fieldReferencesFromSubForm[key];

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

  return transformedFieldReferences;
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
    // console.log(`default value for ${merged.fieldId} used`);
    field.defaultValue = get(resource, field.id, '');
  }

  if (!field.helpText && !field.helpKey) {
    // console.log(`default helpKey for ${merged.id} used`);
    let singularResourceType = resourceType;

    // Make resourceType singular
    if (resourceType.charAt(resourceType.length - 1) === 's') {
      singularResourceType = resourceType.substring(0, resourceType.length - 1);
    }

    field.helpKey = `${singularResourceType}.${field.id}`;
  }

  if (!field.id || !field.name)
    throw new Error('Id and name must be provided for a field');

  return field;
};

const flattenedFieldReferences = (
  fieldReferences,
  resourceType,
  resource,
  ignoreFunctionTransformations
) => {
  if (!fieldReferences) return fieldReferences;

  return Object.keys(fieldReferences).flatMap(fieldReferenceName => {
    const f = fieldReferences[fieldReferenceName];

    if (f && f.formId) {
      const fieldReferencesFromSubForm = applyVisibilityRulesToSubForm(
        f,
        resourceType
      );

      return flattenedFieldReferences(
        fieldReferencesFromSubForm,
        resourceType,
        resource,
        ignoreFunctionTransformations
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

    return {
      key: fieldReferenceName,
      value,
    };
  });
};

const setDefaults = (
  fieldReferences,
  resourceType,
  resource,
  ignoreFunctionTransformations
) =>
  flattenedFieldReferences(
    fieldReferences,
    resourceType,
    resource,
    ignoreFunctionTransformations
  ).reduce((acc, curr) => {
    const { key, value } = curr;

    acc[key] = value;

    return acc;
  }, {});
const getFieldsWithDefaults = (
  fieldMeta,
  resourceType,
  resource,
  ignoreFunctionTransformations = false
) => {
  const { layout, fieldReferences, actions } = fieldMeta;
  const transformedFieldReferences = setDefaults(
    fieldReferences,
    resourceType,
    resource,
    ignoreFunctionTransformations
  );

  return {
    layout,
    fieldReferences: transformedFieldReferences,
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
  const { fieldReferences: transformedFieldReferences } = transformedMeta;
  const extractedInitFunctions = Object.keys(transformedFieldReferences)
    .map(key => {
      const field = transformedFieldReferences[key];
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
  const transformedFieldReferencesWithoutFuncs = Object.keys(
    transformedFieldReferences
  )
    .map(key => {
      const field = transformedFieldReferences[key];
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
    fieldReferences: transformedFieldReferencesWithoutFuncs,
    extractedInitFunctions,
  };
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
  getFieldsWithoutFuncs,
};

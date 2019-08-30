import { deepClone } from 'fast-json-patch';
import { get } from 'lodash';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from './definitions';
import { getResourceSubType } from '../utils/resource';

const getAllOptionsHandlerSubForms = (fields, resourceType, optionsHandler) => {
  fields.forEach(field => {
    const { formId } = field;

    if (formId) {
      const { optionsHandler: foundOptionsHandler, fields } = formMeta[
        resourceType
      ].subForms[formId];

      // Is it necessary to make a deepClone
      if (foundOptionsHandler)
        optionsHandler.push(deepClone(foundOptionsHandler));

      return getAllOptionsHandlerSubForms(fields, resourceType, optionsHandler);
    }
  });

  return optionsHandler;
};

const getAmalgamatedOptionsHandler = (meta, fields, resourceType) => {
  if (!meta) return null;

  const allOptionsHandler = getAllOptionsHandlerSubForms(
    fields,
    resourceType,
    meta.optionsHandler ? [meta.optionsHandler] : []
  );
  const optionsHandler = (fieldId, fields) => {
    const finalRes = allOptionsHandler
      .map(indvOptionsHandler => {
        if (indvOptionsHandler) {
          return indvOptionsHandler(fieldId, fields);
        }

        return null;
      })
      .reduce((acc, curr) => curr || acc, {});

    return finalRes;
  };

  return optionsHandler;
};

const getResourceFormAssets = ({ resourceType, resource, isNew = false }) => {
  let fieldReferences;
  let containers = [];
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
        ({ fieldReferences, containers, preSubmit, init, actions } = meta);
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
          ({ fieldReferences, containers, init, preSubmit, actions } = meta);
        }
      }

      break;

    case 'agents':
    case 'scripts':
    case 'stacks':
      meta = formMeta[resourceType];
      ({ fieldReferences } = meta);

      break;

    default:
      meta = formMeta.default;
      break;
  }

  // const optionsHandler = getAmalgamatedOptionsHandler(
  //   meta,
  //   fieldReferences,
  //   resourceType
  // );

  return {
    fieldMeta: { fieldReferences, containers, actions },
    init,
    preSubmit,
    optionsHandler: null,
  };
};

const applyVisibilityRulesToSubForm = (f, resourceType) => {
  // TODO: We are assuming this factory applies defaults to edit exports
  // no create export has been considered here
  const fieldsFromForm = formMeta[resourceType].subForms[f.formId].fields;

  if (f.visibleWhen && f.visibleWhenAll)
    throw new Error(
      'Incorrect rule, cannot have both a visibleWhen and visibleWhenAll rule in the field view definitions'
    );

  return fieldsFromForm.map(field => {
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

    return fieldCopy;
  });
};

const applyingMissedOutFieldMetaProperties = (
  incompleteField,
  resource,
  resourceType
) => {
  const field = incompleteField;

  Object.keys(field).forEach(key => {
    if (typeof field[key] === 'function') {
      field[key] = field[key](resource);
    }
  });

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

const setDefaults = (fields, resourceType, resource, fieldReferences) => {
  if (!fields || fields.length === 0) return fields;

  return fields
    .map(fieldReferenceName => {
      let f;

      if (typeof fieldReferenceName === 'object') f = fieldReferenceName;
      else f = fieldReferences[fieldReferenceName];

      if (f && f.formId) {
        const fieldMetaHavingVisibilityRules = applyVisibilityRulesToSubForm(
          f,
          resourceType
        );
        const returnedValue = setDefaults(
          fieldMetaHavingVisibilityRules,
          resourceType,
          resource,
          fieldReferences
        );

        return returnedValue;
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

      return applyingMissedOutFieldMetaProperties(
        merged,
        resource,
        resourceType
      );
    })
    .flat();
};

const setDefaultsToContainer = (
  containers,
  resourceType,
  resource,
  fieldReferences
) => {
  if (containers) {
    return containers.map(container => {
      const { fieldSets, type } = container;
      const transformedFieldSets = fieldSets.map(fieldSet => {
        const { fields, containers, ...rest } = fieldSet;
        const transformedFields = setDefaults(
          fields,
          resourceType,
          resource,
          fieldReferences
        );
        const transformedContainers = setDefaultsToContainer(
          containers,
          resourceType,
          resource,
          fieldReferences
        );

        return {
          ...rest,
          fields: transformedFields,
          containers: transformedContainers,
        };
      });

      return {
        type,
        fieldSets: transformedFieldSets,
      };
    });
  }

  return null;
};

const getFieldsWithDefaults = (fieldMeta, resourceType, resource) => {
  const { containers, fieldReferences, actions } = fieldMeta;
  const transformed = setDefaultsToContainer(
    containers,
    resourceType,
    resource,
    fieldReferences
  );

  return {
    containers: transformed,
    fieldReferences,
    actions,
  };
};

const returnFieldWithJustVisibilityRules = f => {
  const { fieldId, visibleWhen, visibleWhenAll } = f;

  if (fieldId) {
    if (visibleWhen) return { fieldId, visibleWhen };
    else if (visibleWhenAll) return { fieldId, visibleWhenAll };

    return { fieldId };
  }
  // else it could be a custom form field
  // just return it completely

  return f;
};

const getFlattenedFieldMetaWithRules = (fieldMeta, resourceType) => {
  const { fields, fieldSets, actions } = fieldMeta;
  const modifiedFields = fields.flatMap(field => {
    if (field.formId) {
      const fieldsWithVisibility = applyVisibilityRulesToSubForm(
        field,
        resourceType
      ).map(returnFieldWithJustVisibilityRules);
      const updatedFieldMeta = { fields: fieldsWithVisibility, fieldSets };

      return getFlattenedFieldMetaWithRules(updatedFieldMeta, resourceType)
        .fields;
    }

    return returnFieldWithJustVisibilityRules(field);
  });

  return { fields: modifiedFields, fieldSets, actions };
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
  getFlattenedFieldMetaWithRules,
};

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
  let fields;
  let fieldSets = [];
  let preSubmit;
  let init;
  let meta;
  const { type } = getResourceSubType(resource);

  // console.log(isNew, resourceType, type, resource);

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
        ({ fields, fieldSets, preSubmit, init } = meta);
      }

      break;

    case 'imports':
    case 'exports':
      meta = formMeta[resourceType];

      if (meta) {
        if (isNew) {
          meta = meta.new;
        } else {
          // get edit form meta branch
          meta = meta[type];
        }

        if (meta) {
          ({ fields, fieldSets, init, preSubmit } = meta);
        }
      }

      break;

    case 'agents':
    case 'scripts':
    case 'stacks':
      meta = formMeta[resourceType];
      ({ fields } = meta);

      break;

    default:
      meta = formMeta.default;
      break;
  }

  const optionsHandler = getAmalgamatedOptionsHandler(
    meta,
    fields,
    resourceType
  );

  return {
    fieldMeta: { fields, fieldSets },
    init,
    preSubmit,
    optionsHandler,
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

const skipExecutionOfFunction = ['formPayloadFn', 'tokenSetForFieldsFn'];
const applyingMissedOutFieldMetaProperties = (
  incompleteField,
  resource,
  resourceType
) => {
  const field = incompleteField;

  Object.keys(field).forEach(key => {
    if (
      typeof field[key] === 'function' &&
      !skipExecutionOfFunction.includes(key)
    ) {
      field[key] = field[key](resource);
    }
  });

  if (!field.id) {
    field.id = field.fieldId;
  }

  if (!field.name && !field.ignoreName) {
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

const setDefaults = (fields, resourceType, resource) => {
  if (!fields || fields.length === 0) return fields;

  return fields
    .map(f => {
      if (f.formId) {
        const fieldMetaHavingVisibilityRules = applyVisibilityRulesToSubForm(
          f,
          resourceType
        );

        return setDefaults(
          fieldMetaHavingVisibilityRules,
          resourceType,
          resource
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

      return applyingMissedOutFieldMetaProperties(
        merged,
        resource,
        resourceType
      );
    })
    .flat();
};

const getFieldsWithDefaults = (fieldMeta, resourceType, resource) => {
  const filled = [];
  const { fields, fieldSets } = fieldMeta;

  if (fieldSets && fieldSets.length > 0) {
    fieldSets.forEach(set => {
      const { fields, ...rest } = set;

      filled.push({
        ...rest,
        fields: setDefaults(fields, resourceType, resource),
      });
    });
  }

  return {
    fields: setDefaults(fields, resourceType, resource),
    fieldSets: filled,
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
  const { fields, fieldSets } = fieldMeta;
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

  return { fields: modifiedFields, fieldSets };
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
  getFlattenedFieldMetaWithRules,
};

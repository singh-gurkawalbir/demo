import { deepClone } from 'fast-json-patch';
import { get } from 'lodash';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from './definitions';
import { getResourceSubType } from '../utils/resource';

const getAllOptionsHandlerSubForms = (
  fields,
  fieldReferences,
  resourceType,
  optionsHandler
) => {
  fields &&
    fields.forEach(field => {
      if (!fieldReferences[field])
        throw new Error(`Could not find fieldReference for field ${field}`);

      const { formId } = fieldReferences[field];

      if (formId) {
        const {
          optionsHandler: foundOptionsHandler,
          fieldReferences,
          fields,
        } = formMeta[resourceType].subForms[formId];

        // Is it necessary to make a deepClone
        if (foundOptionsHandler)
          optionsHandler.push(deepClone(foundOptionsHandler));

        return getAllOptionsHandlerSubForms(
          fields,
          fieldReferences,
          resourceType,
          optionsHandler
        );
      }
    });

  return optionsHandler;
};

export const gatheringOptionsHandlersFromLayouts = (
  meta,
  resourceType,
  allOptionsHandler
) => {
  if (!meta || !meta.layout || !meta.fieldReferences) return null;

  const { layout, fieldReferences } = meta;
  const { fields, containers } = layout;

  if (fields && fields.length > 0) {
    getAllOptionsHandlerSubForms(
      fields,
      fieldReferences,
      resourceType,
      allOptionsHandler
    );
  }

  if (containers && containers.length > 0) {
    containers.forEach(container => {
      const { fieldSets } = container;

      fieldSets.forEach(fieldSet => {
        gatheringOptionsHandlersFromLayouts(
          {
            layout: { ...fieldSet },
            fieldReferences,
          },
          resourceType,
          allOptionsHandler
        );
      });
    });
  }
};

export const getAmalgamatedOptionsHandler = (meta, resourceType) => {
  if (!meta) return null;

  const { optionsHandler } = meta;
  const allOptionsHandler = optionsHandler ? [optionsHandler] : [];

  gatheringOptionsHandlersFromLayouts(meta, resourceType, allOptionsHandler);

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

  if (
    !formMeta[resourceType].subForms[f.formId].layout ||
    !formMeta[resourceType].subForms[f.formId].layout.fields
  ) {
    throw new Error(`could not find fields for given form id ${f.formId}`);
  }

  const fieldReferencesFromSubForm =
    formMeta[resourceType].subForms[f.formId].fieldReferences;
  const fieldsFromSubForm =
    formMeta[resourceType].subForms[f.formId].layout.fields;

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

  return {
    fieldReferencesFromSubForm: transformedFieldReferences,
    fieldsFromSubForm,
  };
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
      else {
        f = fieldReferences[fieldReferenceName];

        if (!fieldReferences[fieldReferenceName]) {
          throw new Error(
            `Could not corresponding field reference for ${fieldReferenceName} Please check fieldReferences definitions`
          );
        }
      }

      if (f && f.formId) {
        const {
          fieldsFromSubForm,
          fieldReferencesFromSubForm,
        } = applyVisibilityRulesToSubForm(f, resourceType);
        const returnedValue = setDefaults(
          fieldsFromSubForm,
          resourceType,
          resource,
          fieldReferencesFromSubForm
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

const setDefaultsToLayout = (
  layout,
  resourceType,
  resource,
  fieldReferences
) => {
  const { fields, containers, ...rest } = layout;
  let transformedFields;

  if (fields && fields.length > 0) {
    transformedFields = setDefaults(
      fields,
      resourceType,
      resource,
      fieldReferences
    );
  }

  let transformedContainers;

  if (containers && containers.length > 0) {
    transformedContainers = containers.map(container => {
      const { fieldSets, ...rest } = container;
      const transformedFieldSets = fieldSets.map(fieldSet =>
        setDefaultsToLayout(fieldSet, resourceType, resource, fieldReferences)
      );

      return { fieldSets: transformedFieldSets, ...rest };
    });
  }

  return {
    fields: transformedFields,
    containers: transformedContainers,
    ...rest,
  };
};

const getFieldsWithDefaults = (fieldMeta, resourceType, resource) => {
  const { layout, fieldReferences, actions } = fieldMeta;
  const transformed = setDefaultsToLayout(
    layout,
    resourceType,
    resource,
    fieldReferences
  );

  return {
    layout: transformed,
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

const fieldsWithCascadedVisibleRules = (
  fields,
  resourceType,
  fieldReferences
) => {
  if (!fields || fields.length === 0) return fields;

  return fields
    .flatMap(fieldReferenceName => {
      let f;

      if (typeof fieldReferenceName === 'object') f = fieldReferenceName;
      else {
        if (!fieldReferences[fieldReferenceName]) {
          throw new Error(
            `Could not corresponding field reference for ${fieldReferenceName} Please check fieldReferences definitions`
          );
        }

        f = fieldReferences[fieldReferenceName];
      }

      if (f && f.formId) {
        const {
          fieldsFromSubForm,
          fieldReferencesFromSubForm,
        } = applyVisibilityRulesToSubForm(f, resourceType);
        const returnedValue = fieldsWithCascadedVisibleRules(
          fieldsFromSubForm,
          resourceType,
          fieldReferencesFromSubForm
        );

        return returnedValue;
      }

      return f;
    })
    .map(returnFieldWithJustVisibilityRules);
};

const getFlattenedFieldMetaWithRules = (
  layout,
  resourceType,
  fieldReferences,
  actions
) => {
  const { fields, containers, ...rest } = layout;
  let transformedFields;

  if (fields && fields.length > 0) {
    transformedFields = fieldsWithCascadedVisibleRules(
      fields,
      resourceType,
      fieldReferences
    );
  }

  let transformedContainers;

  if (containers && containers.length > 0) {
    transformedContainers = containers.map(container => {
      const { fieldSets, ...rest } = container;
      const transformedFieldSets = fieldSets.map(fieldSet => {
        const { fields, ...rest } = fieldSet;
        const { layout } = getFlattenedFieldMetaWithRules(
          fieldSet,
          resourceType,
          fieldReferences,
          actions
        );

        return { fields: layout.fields, ...rest };
      });

      return { fieldSets: transformedFieldSets, ...rest };
    });
  }

  return {
    layout: {
      fields: transformedFields,
      containers: transformedContainers,
      ...rest,
    },
    fieldReferences,
    actions,
  };
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
  getFlattenedFieldMetaWithRules,
};

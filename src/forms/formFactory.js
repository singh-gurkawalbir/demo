import { deepClone } from 'fast-json-patch';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from '../forms/definitions';

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
  if (!meta || !meta.optionsHandler) return null;
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

// TODO: We are considering editing a resource...maybe we should pass in a prop
// so that the getResourceFromAssets picks out the
// correct meta data like an enum create, edit
const getResourceFormAssets = ({ resourceType, resource, connection }) => {
  let fields;
  let fieldSets = [];
  let preSubmit;
  let init;
  let meta;
  let typeOfConnection;

  // console.log(resourceType, connection, resource);
  // FormMeta fromMeta[resourceType][connectionType]

  // FormMeta fromMeta[resourceType].custom.[connectionType]
  // optionsHandler comes in here
  switch (resourceType) {
    case 'connections':
      if (resource && resource.assistant) {
        meta = formMeta.connections.custom[resource.type];

        if (meta) {
          meta = meta[resource.assistant];
        }
      } else {
        meta = formMeta.connections[resource.type];
      }

      if (meta) {
        ({ fields, fieldSets, preSubmit, init } = meta);
      }

      break;

    case 'imports':
    case 'exports':
      meta = formMeta[resourceType];

      if (meta) {
        // We are only considering edits of exports
        // //Vinay suggested using the connection to determine
        // const connectionType =
        //   exportAdaptorTypeToConnectionType[meta.adaptorType];

        // meta = exportAdaptorTypeToConnectionType.edit[connectionType];

        if (connection) {
          typeOfConnection = connection.type;
        } else {
          // for simple, distributed, webhooks
          typeOfConnection = resource.type;
        }

        meta = meta[typeOfConnection];

        if (meta) {
          ({ fields, fieldSets, init, preSubmit } = meta);
        }
      }

      break;
    case 'scripts':
      meta = formMeta[resourceType];
      ({ fields } = meta);

      break;
    default:
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

// TODO: is this fn available in an existing package?
// if so, use that instead, otherwise move this into a util file.
const extractValue = (path, resource) => {
  if (!resource) return;

  if (!path) return resource;

  if (typeof path !== 'string') return;

  if (resource[path]) return resource[path];

  const segments = path.split('.');
  let value = resource;

  // skip the first node since it is the resourceType and is not part of the
  // resource field path. earlier resourceType used to be there but its excluded
  for (let i = 0; i < segments.length; i += 1) {
    // logger.info('segment: ' + segments[i])
    // logger.info(value[segments[i]])
    // if the last iteration resulted in no value, and yet the path indicates
    // that there still should be another node in the object hierarchy, return.
    // return if we have an object but no child object exists in the next path.
    // otherwise set the value to the new node and iterate.
    if (!value || value[segments[i]] === undefined) return;
    value = value[segments[i]];
  }

  return value;
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

      return fieldCopy;
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

  if (!field.helpText || !field.helpKey) {
    // console.log(`default helpKey for ${merged.id} used`);
    let singularResourceType = resourceType;

    // Make resourceType singular
    if (resourceType.charAt(resourceType.length - 1) === 's') {
      singularResourceType = resourceType.substring(0, resourceType.length - 1);
    }

    field.helpKey = `${singularResourceType}.${field.fieldId}`;
  }

  // Why can't we do a check for the property directly...
  // merged['defaultValue']
  if (!Object.keys(field).includes('defaultValue')) {
    // console.log(`default value for ${merged.fieldId} used`);
    field.defaultValue = extractValue(field.fieldId, resource);
  }

  // if name isn't there, fill it!
  if (!field.name && field.fieldId) {
    field.name = `/${field.fieldId.replace(/\./g, '/')}`;
  }

  if (!field.id) {
    field.id = field.fieldId;
  }

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

      const merged = {
        resourceId: resource._id,
        resourceType,
        ...masterFieldHash[resourceType][f.fieldId],
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

const getFlattenedFieldMetaWithRules = (fieldMeta, resourceType, resource) => {
  // TODO: I don't really need to set defaults, the getFieldsWithDefaults
  // has support to add visibility When rules for fieldMeta having formId
  // or deeply nested forms
  const flattenedFieldMeta = getFieldsWithDefaults(
    fieldMeta,
    resourceType,
    resource
  );
  // Lets retain fieldId, visibleWhen and lets remove all
  // other properties.
  // since fieldSets aren't expected to have formId nor
  // the formIds are expected to have any fieldSets,
  // so lets use the fields from getFieldsWithDefaults
  const fieldMetaWithJustFieldIdAndRules = flattenedFieldMeta.fields.map(
    field => {
      const { fieldId, visibleWhen } = field;

      if (visibleWhen) return { fieldId, visibleWhen };

      return { fieldId };
    }
  );

  return fieldMetaWithJustFieldIdAndRules;
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
  getFlattenedFieldMetaWithRules,
};

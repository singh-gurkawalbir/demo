// import masterFieldHash from '../formsMetadata/generatedHash/index';
// import formMeta from '../formsMetadata/generatedHash/resourceViews';
// import masterFieldHash from '../formsMetadata/masterFieldHash';
// import formMeta from '../formsMetadata/definitions';
import { deepClone } from 'fast-json-patch';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from '../forms/definitions';
import { defaultPatchSetConverter } from './utils';

// // webhook is of type not adaptor type
// const exportAdaptorTypeToConnectionType = {
//   FTPExport: 'ftp',
//   HTTPExport: 'http',
//   RESTExport: 'rest',
//   // SalesforceExport: 'salesForce',
//   // NetSuiteExport: 'netsuite',
// };
const getResourceFormAssets = ({ resourceType, resource }) => {
  let fields;
  let fieldSets = [];
  let converter;
  let initializer;
  let meta;

  // console.log(resourceType, connection, resource);
  // Formmeta fromMeta[resourceType][connectionType]

  // Formmeta fromMeta[resourceType].custom.[connectionType]
  // optionsHandler comes in here
  switch (resourceType) {
    case 'connections':
      if (resource.assistant) {
        meta = formMeta.connections.custom[resource.type];

        if (meta) {
          meta = meta[resource.assistant];
        }
      } else {
        meta = formMeta.connections[resource.type];
      }

      if (meta) {
        ({ fields, fieldSets, converter, initializer } = meta);
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
        meta = meta.common;

        if (meta) {
          ({ fields, fieldSets, converter, initializer } = meta);
        }
      }

      break;

    default:
      break;
  }

  const { optionsHandler } = meta;

  return {
    fieldMeta: { fields, fieldSets },
    converter: converter || defaultPatchSetConverter,
    initializer,
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
    // that there still should be another node in the object heirarchy, return.
    // return if we have an object but no child object exists in the next path.
    // otherwise set the value to the new node and iterate.
    if (!value || value[segments[i]] === undefined) return;
    value = value[segments[i]];
  }

  return value;
};

const applyVisibilityRulesToForm = (f, resourceType) => {
  const { fields: fieldsFromForm } = formMeta[resourceType][f.formId];

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

  // if name isn't there
  if (!field.name) {
    field.name = `/${field.fieldId.replace(/\./g, '/')}`;
  }

  // Are fieldIds unique?
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
        const fieldMetaHavingVisibilityRules = applyVisibilityRulesToForm(
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

  if (fieldSets) {
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

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
};

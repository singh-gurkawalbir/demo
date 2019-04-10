// import masterFieldHash from '../formsMetadata/generatedHash/index';
// import formMeta from '../formsMetadata/generatedHash/resourceViews';
// import masterFieldHash from '../formsMetadata/masterFieldHash';
// import formMeta from '../formsMetadata/definitions';
import masterFieldHash from '../forms/fieldDefinitions';
import formMeta from '../forms/definitions';
import { defaultPatchSetConverter } from './utils';

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

const setDefaults = (fields, resourceType, resource) => {
  if (!fields || fields.length === 0) return fields;

  return fields
    .map(f => {
      if (f.formId) {
        let { fields: fieldsFromForm } = formMeta[resourceType][f.formId];

        if (f.visibleWhen || f.visibleWhenAll) {
          if (f.visibleWhen && f.visibleWhenAll)
            throw new Error('Incorrect rule');

          fieldsFromForm = fieldsFromForm.map(field => {
            const fieldCopy = { ...field };

            if (fieldCopy.visibleWhen && fieldCopy.visibleWhenAll)
              throw new Error('Incorrect rule');

            if (f.visibleWhen) {
              fieldCopy.visibleWhen = fieldCopy.visibleWhen || [];
              fieldCopy.visibleWhen.push(...f.visibleWhen);

              return fieldCopy;
            }

            fieldCopy.visibleWhenAll = fieldCopy.visibleWhenAll || [];

            fieldCopy.visibleWhenAll.push(...f.visibleWhenAll);

            return fieldCopy;
          });

          return setDefaults(fieldsFromForm, resourceType, resource);
        }
      }

      const merged = {
        resourceId: resource._id,
        resourceType,
        ...masterFieldHash[resourceType][f.fieldId],
        ...f,
      };

      Object.keys(merged).forEach(key => {
        if (typeof merged[key] === 'function') {
          merged[key] = merged[key](resource);
        }
      });

      if (!merged.helpText && !merged.helpKey) {
        // console.log(`default helpKey for ${merged.id} used`);
        merged.helpKey = merged.fieldId;
      }

      // Why can't we do a check for the property directly...
      // merged['defaultValue']
      if (!Object.keys(merged).includes('defaultValue')) {
        // console.log(`default value for ${merged.fieldId} used`);
        merged.defaultValue = extractValue(merged.fieldId, resource);
      }

      // if name isn't there
      if (!merged.name) {
        merged.name = `/${merged.fieldId.replace(/\./g, '/')}`;
      }

      // Are fieldIds unique?
      if (!merged.id) {
        merged.id = merged.fieldId;
      }

      return merged;
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

  const Allfields = setDefaults(fields, resourceType, resource);

  return {
    fields: Allfields,
    fieldSets: filled,
  };
};

export default {
  getResourceFormAssets,
  getFieldsWithDefaults,
};

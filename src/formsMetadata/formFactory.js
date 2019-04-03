import masterFieldHash from './masterFieldHash';
import formMeta from './definitions';
import { defaultPatchSetConverter } from './utils';

const getResourceFormAssets = ({ resourceType, resource }) => {
  let { fields } = formMeta.common;
  let fieldSets = [];
  let converter;
  let initializer;
  let meta;

  // console.log(resourceType, connection, resource);

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
        meta = meta[resourceType];

        if (meta) {
          ({ fields, fieldSets, converter, initializer } = meta);
        }
      }

      break;

    default:
      break;
  }

  return {
    fieldMeta: { fields, fieldSets },
    converter: converter || defaultPatchSetConverter,
    initializer,
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
  // resource field path.
  for (let i = 1; i < segments.length; i += 1) {
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

  return fields.map(f => {
    const merged = {
      resourceId: resource._id,
      resourceType,
      ...masterFieldHash[f.fieldId],
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

    if (!Object.keys(merged).includes('defaultValue')) {
      // console.log(`default value for ${merged.fieldId} used`);
      merged.defaultValue = extractValue(merged.fieldId, resource);
    }

    if (!merged.id) {
      merged.id = merged.fieldId;
    }

    return merged;
  });
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

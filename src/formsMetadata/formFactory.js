import masterFieldHash from '../formsMetadata/generatedHash/index';
import formMeta from '../formsMetadata/generatedHash/resourceViews';
import { defaultPatchSetConverter } from './utils';

const getResourceFormAssets = (connection, resourceType, resource) => {
  let fields = formMeta.common;
  let fieldSets = [];
  let converter;
  let initializer;
  let meta;

  switch (resourceType) {
    case 'connections':
      if (resource.assistant) {
        meta = formMeta.connections.custom[resource.type];

        if (customElements) {
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
      if (connection) {
        meta = formMeta[resourceType];

        if (meta) {
          meta = meta[connection.type];

          if (meta) {
            ({ fields, fieldSets, converter, initializer } = meta);
          }
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

const setDefaults = (fields, resource) => {
  if (!fields || fields.length === 0) return fields;

  return fields.map(f => {
    const merged = { ...masterFieldHash[f.id], ...f };

    Object.keys(merged).forEach(key => {
      if (typeof merged[key] === 'function') {
        merged[key] = merged[key](resource);
      }
    });

    return merged;
  });
};

const getFieldsWithDefaults = (fieldMeta, resource) => {
  const filled = [];
  const { fields, fieldSets } = fieldMeta;

  if (fieldSets) {
    fieldSets.forEach(set => {
      const { fields, ...rest } = set;

      filled.push({
        ...rest,
        fields: setDefaults(fields, resource),
      });
    });
  }

  return {
    fields: setDefaults(fields, resource),
    fieldSets: filled,
  };
};

export default ({ resourceType, connection, resource = {} }) => {
  const {
    fieldMeta,
    converter,
    initializer,
    optionsHandler,
  } = getResourceFormAssets(connection, resourceType, resource);
  let metaWithDefaults = getFieldsWithDefaults(fieldMeta, resource);

  if (initializer) {
    metaWithDefaults = initializer({ resource, fieldMeta: metaWithDefaults });
  }

  return {
    optionsHandler,
    fieldMeta: metaWithDefaults,
    formValueToPatchSetConverter: converter,
  };
};

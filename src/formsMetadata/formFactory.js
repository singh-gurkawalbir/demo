import Handlebars from 'handlebars';
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

  return {
    fieldMeta: { fields, fieldSets },
    converter: converter || defaultPatchSetConverter,
    initializer,
  };
};

const setDefaults = fields => {
  if (!fields || fields.length === 0) return fields;

  return fields.map(f => {
    if (f && masterFieldHash[f.id]) {
      const mergedFields = { ...masterFieldHash[f.id], ...f };

      return mergedFields;
    }

    return f;
  });
};

const getFieldsWithDefaiults = fieldMeta => {
  const filled = [];
  const { fields, fieldSets } = fieldMeta;

  if (fieldSets) {
    fieldSets.forEach(set => {
      const { fields, ...rest } = set;

      filled.push({
        ...rest,
        fields: setDefaults(fields),
      });
    });
  }

  return {
    fields: setDefaults(fields),
    fieldSets: filled,
  };
};

export default ({ resourceType, connection, resource = {} }) => {
  const { fieldMeta, converter, initializer } = getResourceFormAssets(
    connection,
    resourceType,
    resource
  );
  const metaWithDefaults = getFieldsWithDefaiults(fieldMeta);
  const template = Handlebars.compile(JSON.stringify(metaWithDefaults));
  let metaWithValues;

  try {
    metaWithValues = JSON.parse(template(resource));
  } catch (e) {
    metaWithValues = [];
  }

  if (initializer) {
    metaWithValues = initializer({ resource, fieldMeta: metaWithValues });
  }

  return {
    fieldMeta: metaWithValues,
    formValueToPatchSetConverter: converter,
  };
};

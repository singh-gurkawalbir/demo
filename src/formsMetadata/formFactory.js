import formMeta from './definitions';
import { defaultValueInitializer, defaultPatchSetConverter } from './utils';

const getResourceFormAssets = (connection, resourceType, resource) => {
  let fields = formMeta.common;
  let fieldSets = [];
  let converter = defaultPatchSetConverter;
  let initializer = defaultValueInitializer;
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
        ({ fields, fieldSets } = meta);
        converter = meta.converter || defaultPatchSetConverter;
        initializer = meta.initializer || defaultValueInitializer;
      }

      break;

    case 'imports':
    case 'exports':
      if (connection) {
        meta = formMeta[resourceType];

        if (meta) {
          meta = meta[connection.type];

          if (meta) {
            ({ fields, fieldSets } = meta);
            converter = meta.converter || defaultPatchSetConverter;
            initializer = meta.initializer || defaultValueInitializer;
          }
        }
      }

      break;

    default:
      break;
  }

  return { fields, fieldSets, converter, initializer };
};

const setDefaults = (fields, values) => {
  if (!values || !fields || fields.length === 0) return fields;

  return fields.map(f => {
    if (f && values[f.name]) {
      return { ...f, defaultValue: values[f.name] };
    }

    return f;
  });
};

export default ({ resourceType, connection, resource = {} }) => {
  const { fields, fieldSets, converter, initializer } = getResourceFormAssets(
    connection,
    resourceType,
    resource
  );
  const formValues = initializer(resource);
  const filled = [];

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
    fields: setDefaults(fields, formValues),
    fieldSets: filled,
    formValueToPatchSetConverter: converter,
  };
};

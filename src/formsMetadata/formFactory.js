import formMeta from './definitions';
import { defaultValueInitializer, defaultPatchSetConverter } from './utils';

const getResourceFormAssets = (connection, resourceType, resource) => {
  let fields = formMeta.common;
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
        if (Array.isArray(meta)) {
          fields = meta;
        } else {
          fields = meta.fields || [];
          converter = meta.converter || defaultPatchSetConverter;
          initializer = meta.initializer || defaultValueInitializer;
        }
      }

      break;

    case 'imports':
    case 'exports':
      if (connection) {
        meta = formMeta[resourceType];

        if (meta) {
          meta = meta[connection.type];

          if (meta) fields = meta;
        }
      }

      break;

    default:
      break;
  }

  return { fields, converter, initializer };
};

const setDefaults = (fields, values) => {
  if (!values || !fields) return fields;

  return fields.map(f => {
    if (f && values[f.name]) {
      return { ...f, defaultValue: values[f.name] };
    }

    return f;
  });
};

export default ({ resourceType, connection, resource = {} }) => {
  const { fields, converter, initializer } = getResourceFormAssets(
    connection,
    resourceType,
    resource
  );
  const fieldsWithDefaults = setDefaults(fields, initializer(resource));

  return {
    fields: fieldsWithDefaults,
    formValueToPatchSetConverter: converter,
  };
};

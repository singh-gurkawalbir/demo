import formMeta from './definitions';
import { defaultInitializer, defaultPatchSetConverter } from './utils';

const getResourceFormAssets = (connection, resourceType, resource) => {
  let fields = formMeta.common;
  let fieldSets = [];
  let converter = defaultPatchSetConverter;
  let initializer = defaultInitializer;
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
        initializer = meta.initializer || defaultInitializer;
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
            initializer = meta.initializer || defaultInitializer;
          }
        }
      }

      break;

    default:
      break;
  }

  return {
    fieldMeta: { fields, fieldSets },
    converter,
    initializer,
  };
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
  const { fieldMeta, converter, initializer } = getResourceFormAssets(
    connection,
    resourceType,
    resource
  );
  const { formValues, fieldMeta: initializedFieldMeta } = initializer({
    resource,
    fieldMeta,
  });
  const filled = [];
  const { fields, fieldSets } = initializedFieldMeta;

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
    fieldMeta: {
      fields: setDefaults(fields, formValues),
      fieldSets: filled,
    },
    formValueToPatchSetConverter: converter,
  };
};

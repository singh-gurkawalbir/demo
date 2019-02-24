import formMeta from './definitions';

const defaultValueInitializer = values => {
  const results = {};
  const recurse = (values, path) => {
    if (typeof values !== 'object') {
      results[path] = values;

      return;
    }

    Object.keys(values).forEach(key => recurse(values[key], `${path}/${key}`));
  };

  recurse(values, '');

  return results;
};

const defaultPatchSetConverter = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));
const getResourceFormAssets = (connection, resourceType, resource) => {
  let fields = formMeta.common;
  const converter = defaultPatchSetConverter;
  const initializer = defaultValueInitializer;
  let meta;

  switch (resourceType) {
    case 'connections':
      meta = formMeta.connections[resource.type];

      if (meta) fields = meta;
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

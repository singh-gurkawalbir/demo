import defaultFields from './definitions/default';
import httpConnectionFields from './definitions/connections/http';
import httpExportFields from './definitions/exports/http';

const initValues = values => {
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

const getFields = (connection, resourceType, resource) => {
  let fields = defaultFields;

  switch (resourceType) {
    case 'connections':
      if (resource.type === 'http') {
        fields = httpConnectionFields;
      }

      break;

    case 'exports':
      if (connection && connection.type === 'http') {
        fields = httpExportFields;
      }

      break;

    default:
      break;
  }

  return fields;
};

const convertToPatchSet = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

export default ({ connection, resourceType, resource = {} }) => ({
  fields: getFields(connection, resourceType, resource),
  values: initValues(resource),
  convertToPatchSet,
});

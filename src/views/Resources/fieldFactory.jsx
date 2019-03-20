import defaultFields from './definitions/default';
import httpConnectionFields from './definitions/connections/specificConnections/http';
import ftpConnectionFields from './definitions/connections/specificConnections/ftp';
import httpExportFields from './definitions/exports/http';
import newConnections from './definitions/connections/newConnection';

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
  let allFormRelevantData = defaultFields;

  console.log(`check here ${resourceType} ${resource.type}`);

  switch (resourceType) {
    case 'connections':
      if (resource.type === 'http') {
        const { formMeta, ...rest } = httpConnectionFields;

        allFormRelevantData = { fields: formMeta, ...rest };
      }

      if (resource.type === 'ftp') {
        const { formMeta, ...rest } = ftpConnectionFields;

        allFormRelevantData = { fields: formMeta, ...rest };
      }

      if (resource.type === 'new') {
        allFormRelevantData = newConnections;
      }

      break;

    case 'exports':
      if (connection && connection.type === 'http') {
        allFormRelevantData = httpExportFields;
      }

      break;

    default:
      break;
  }

  return allFormRelevantData;
};

const convertToPatchSet = values =>
  Object.keys(values).map(key => ({
    op: 'replace',
    path: key,
    value: values[key],
  }));

export default ({ connection, resourceType, resource = {} }) => ({
  allFormRelevantData: getFields(connection, resourceType, resource),
  values: initValues(resource),
  convertToPatchSet,
});

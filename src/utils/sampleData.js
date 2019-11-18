import { isEmpty } from 'lodash';
import jsonUtil from './json';

export default function getFormattedSampleData({
  connection,
  sampleData,
  useSampleDataAsArray,
  resourceType,
  resourceName,
}) {
  const data = {
    connection: {},
  };
  const _sd = sampleData || {
    myField: 'sample',
  };

  data.data = useSampleDataAsArray ? [_sd] : _sd;

  if (connection) {
    data.connection.name = connection.name;
    const connSubDoc = connection[connection.type];
    const hbSubDoc = {};

    if (connSubDoc) {
      if (connSubDoc.unencrypted && !isEmpty(connSubDoc.unencrypted)) {
        hbSubDoc.unencrypted = connSubDoc.unencrypted;
      }

      if (connSubDoc.encrypted && !isEmpty(connSubDoc.encrypted)) {
        hbSubDoc.encrypted = jsonUtil.maskValues(connSubDoc.encrypted);
      }
    }

    data.connection[connection.type] = hbSubDoc;
  }

  data[resourceType === 'imports' ? 'import' : 'export'] = {
    name: resourceName,
  };

  return data;
}

export function getDefaultData(obj) {
  const _obj = obj;

  Object.keys(_obj).forEach(key => {
    if (typeof _obj[key] === 'object' && _obj[key] !== null) {
      getDefaultData(_obj[key]);
    } else {
      _obj[key] = { default: '' };
    }
  });

  return _obj;
}

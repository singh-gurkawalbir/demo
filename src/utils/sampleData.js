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
    data: {
      myField: 'sample',
    },
  };

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

  if (sampleData) {
    data.data = useSampleDataAsArray ? [sampleData] : sampleData;
  }

  data[resourceType === 'imports' ? 'import' : 'export'] = {
    name: resourceName,
  };

  return data;
}

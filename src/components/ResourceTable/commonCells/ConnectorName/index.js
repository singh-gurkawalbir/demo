import { useSelector } from 'react-redux';
import { getApp } from '../../../../constants/applications';
import { getResourceSubType } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';

export default function ConnectorName({resource}) {
  const { type, assistant, resourceType } = getResourceSubType(resource);
  const { _connectionId } = resource || {};
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)
  );

  let name;

  if (type === 'simple') {
    name = 'Data Loader';
  } else if (type !== 'rdbms') {
    name = getApp(type, assistant).name;
  } else if (resourceType === 'exports' || resourceType === 'imports') {
    name = getApp(connection?.rdbms?.type).name;
  } else if (resource?.rdbms?.type) {
    name = getApp(resource.rdbms.type).name;
  } else {
    name = 'RDBMS';
  }

  if (!name) {
    console.log(type, assistant);
  }

  return name || 'NA';
}

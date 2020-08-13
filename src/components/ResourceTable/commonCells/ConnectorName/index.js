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

  if (!resource) {
    return null;
  }

  if (type !== 'rdbms') {
    return getApp(type, assistant).name;
  }

  if (resourceType === 'exports' || resourceType === 'imports') {
    return getApp(connection?.rdbms?.type).name;
  }
  if (resource?.rdbms?.type) {
    return getApp(resource.rdbms.type).name;
  }

  return 'RDBMS';
}

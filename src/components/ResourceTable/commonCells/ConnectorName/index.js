import { useSelector } from 'react-redux';
import { getApp } from '../../../../constants/applications';
import { getResourceSubType } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';

export default function ConnectorName({resource}) {
  const { type, assistant, resourceType } = getResourceSubType(resource);
  const { _connectionId } = resource || {};
  const rdbmsConnType = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)?.rdbms?.type
  );

  if (type === 'simple') return 'Data Loader';

  if (type !== 'rdbms') {
    return getApp(type, assistant).name || null;
  }

  if (resourceType === 'exports' || resourceType === 'imports') {
    return getApp(rdbmsConnType).name;
  }

  // must be a connection
  if (resource?.rdbms?.type) {
    return getApp(resource.rdbms.type).name;
  }

  return 'RDBMS';
}

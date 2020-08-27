import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getApp } from '../../../../constants/applications';
import { getResourceSubType } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';

export default function ConnectorName({resource}) {
  const { type, assistant, resourceType } = useMemo(() => getResourceSubType(resource), [resource]);
  const _connectionId = resource?._connectionId;
  const rdbmsType = resource?.rdbms?.type;
  const rdbmsConnType = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)?.rdbms?.type
  );

  const out = useMemo(() => {
    if (type === 'simple') return 'Data Loader';

    if (type !== 'rdbms') {
      return getApp(type, assistant).name || null;
    }

    if (resourceType === 'exports' || resourceType === 'imports') {
      return getApp(rdbmsConnType).name;
    }

    // must be a connection
    if (rdbmsType) {
      return getApp(rdbmsType).name;
    }

    return 'RDBMS';
  }, [type, resourceType, rdbmsType, assistant, rdbmsConnType]);

  return out;
}

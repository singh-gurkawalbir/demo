import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getApp } from '../../../../constants/applications';
import { getResourceSubType } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';

export default function ConnectorName({ resource }) {
  const { type, assistant, resourceType } = useMemo(() => getResourceSubType(resource), [resource]);
  const _connectionId = resource?._connectionId;
  const useRestForm = resource?.http?.formType === 'rest';
  const rdbmsType = resource?.rdbms?.type;
  const rdbmsConnType = useSelector(state =>
    selectors.resource(state, 'connections', _connectionId)?.rdbms?.type
  );

  const out = useMemo(() => {
    if (type === 'simple') return 'Data Loader';

    if (type !== 'rdbms') {
      const appType = getApp(type, assistant).name || null;

      if (appType?.toLowerCase() === 'http' && useRestForm) {
        return 'REST API';
      }

      return appType;
    }

    if (resourceType === 'exports' || resourceType === 'imports') {
      return getApp(rdbmsConnType).name;
    }

    // must be a connection
    if (rdbmsType) {
      return getApp(rdbmsType).name;
    }

    return 'RDBMS';
  }, [type, resourceType, rdbmsType, assistant, rdbmsConnType, useRestForm]);

  return out || null;
}

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getApp, getHttpConnector } from '../../../../constants/applications';
import { getResourceSubType, rdbmsSubTypeToAppType } from '../../../../utils/resource';
import { selectors } from '../../../../reducers';

export default function ConnectorName({ resource }) {
  const { type, assistant, resourceType } = useMemo(() => getResourceSubType(resource), [resource]);
  const _connectionId = resource?._connectionId;
  const useRestForm = resource?.http?.formType === 'rest';
  const rdbmsType = rdbmsSubTypeToAppType(resource?.rdbms?.type);
  const _httpConnectorId = useSelector(state =>
    selectors.resource(state, 'connections', resourceType === 'connections' ? resource._id : _connectionId)?.http?._httpConnectorId);

  const rdbmsConnType = useSelector(state =>
    rdbmsSubTypeToAppType(selectors.resource(state, 'connections', _connectionId)?.rdbms?.type)
  );

  const out = useMemo(() => {
    if (type === 'simple') return 'Data loader';
    if (_httpConnectorId) {
      const httpConnector = getHttpConnector(_httpConnectorId);

      if (httpConnector) {
        return httpConnector.name;
      }
    }

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

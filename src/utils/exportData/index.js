import { hashCode } from '../string';

export const makeExportResource = (resource, connectionId, connectorId) => {
  const kind = resource?.kind || 'virtual';
  let exportResource;

  if (kind === 'virtual') {
    exportResource = resource?.virtual;
  }
  if (!exportResource) return {};
  exportResource = {
    ...exportResource,
    _connectionId: exportResource._connectionId || connectionId,
    _connectorId: exportResource._connectorId || connectorId,
  };
  const key = String(hashCode(exportResource, true));

  return {
    kind,
    key,
    exportResource,
  };
};

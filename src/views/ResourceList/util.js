export const additionalFilter = resourceType => {
  if (resourceType === 'exports' || resourceType === 'imports') {
    return {
      _connectorId: { $exists: false },
    };
  }
  if (resourceType === 'iClients') {
    return { provider: 'custom_oauth2' };
  }

  return null;
};

export default {
  additionalFilter,
};

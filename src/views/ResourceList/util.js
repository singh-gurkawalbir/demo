export const connectorFilter = resourceType => {
  if (resourceType === 'exports' || resourceType === 'imports') {
    return {
      _connectorId: { $exists: false },
    };
  }

  return null;
};

export default {
  connectorFilter,
};

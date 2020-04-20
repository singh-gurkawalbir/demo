export default {
  'export.sears.method': {
    type: 'suitescriptapimethod',
    label: 'API',
    _connectionId: r => r && r.export && r.export._connectionId,
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    filters: { $and: [{ isImport: true }, { isRealtime: false }] },
    required: true,
  },
};

export default {
  'export.newegg.method': {
    type: 'suitescriptapimethod',
    label: 'API',
    _connectionId: r => r && r.export && r.export._connectionId,
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    filters: { $and: [{ isImport: true }, { isRealtime: false }] },
    required: true,
  },
  'export.newegg.methodConfig': {
    type: 'suitescriptapiparameters',
    _connectionId: r => r && r.export && r.export._connectionId,
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    apiMethod: r => r?.export?.newegg?.method,
    required: true,
    visibleWhen: [{field: 'export.newegg.method', isNot: ['']}],
  },
};

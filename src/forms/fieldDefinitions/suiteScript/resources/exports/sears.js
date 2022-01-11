export default {
  'export.sears.method': {
    isLoggable: true,
    type: 'suitescriptapimethod',
    label: 'API',
    _connectionId: r => r && r.export && r.export._connectionId,
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    filters: { $and: [{ isImport: true }, { isRealtime: false }] },
    required: true,
  },
  'export.sears.methodConfig': {
    isLoggable: true,
    type: 'suitescriptapiparameters',
    _connectionId: r => r && r.export && r.export._connectionId,
    ssLinkedConnectionId: r => r && r.ssLinkedConnectionId,
    apiMethod: r => r?.export?.sears?.method,
    required: true,
    visibleWhen: [{field: 'export.sears.method', isNot: ['']}],
  },
};

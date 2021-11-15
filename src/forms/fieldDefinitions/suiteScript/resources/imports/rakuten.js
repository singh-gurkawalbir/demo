export default {
  'import.rakuten.method': {
    loggable: true,
    type: 'suitescriptapimethod',
    label: 'API',
    _connectionId: r => r?.import?._connectionId,
    ssLinkedConnectionId: r => r?.ssLinkedConnectionId,
    filters: r => ({ $and: [{ isImport: false }, { isRealtime: r.type === 'REALTIME_EXPORT' }] }),
    required: true,
  },
};

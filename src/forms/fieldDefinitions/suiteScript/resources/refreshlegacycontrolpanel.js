export default {
  clearCache: {
    loggable: true,
    type: 'checkbox',
    label: 'Refresh integration caches',
    defaultValue: false,
  },
  refreshMappings: {
    loggable: true,
    type: 'checkbox',
    label: 'Refresh integration mappings',
    defaultValue: false,
  },
  object: {
    loggable: true,
    label: 'Refresh object',
    required: true,
    type: 'refreshableselect',
    // filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r.ssLinkedConnectionId}/recordTypes/dummy/selectFieldValues/customrecord_celigo_supported_object`,
    placeholder: 'Please select',
    connectionId: r => r && r.ssLinkedConnectionId,
    requiredWhenAll: [
      {
        field: 'clearCache',
        is: [false],
      },
      {
        field: 'refreshMappings',
        is: [false],
      },
    ],
  },
};

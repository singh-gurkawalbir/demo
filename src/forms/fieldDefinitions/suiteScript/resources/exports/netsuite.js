export default {
  'netsuite.restlet.recordType': {
    label: 'Record type',
    required: true,
    type: 'refreshableselect',
    filterKey: 'suitescript-recordTypes',
    commMetaPath: r =>
      r &&
      `netsuite/metadata/suitescript/connections/${r._connectionId}/recordTypes`,
    resourceType: 'recordTypes',
    placeholder: 'Please select a record type',
    connectionId: r => r && r._connectionId,
  },
};

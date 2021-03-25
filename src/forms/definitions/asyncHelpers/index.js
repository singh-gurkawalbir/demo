export default {
  new: {
    preSave: formValues => ({ '/name': formValues['/name'] }),
  },
  preSave: formValues => {
    const values = { ...formValues };

    delete values._connectionId;

    return values;
  },

  fieldMap: {
    name: { fieldId: 'name' },
    // description: { fieldId: 'description' },
    'http.status._exportId': { fieldId: 'http.status._exportId' },
    'http.status.initialWaitTime': { fieldId: 'http.status.initialWaitTime' },
    'http.status.pollWaitTime': { fieldId: 'http.status.pollWaitTime' },
    'http.status.statusPath': { fieldId: 'http.status.statusPath' },
    'http.status.inProgressValues': { fieldId: 'http.status.inProgressValues' },
    'http.status.doneWithoutDataValues': {
      fieldId: 'http.status.doneWithoutDataValues',
    },
    'http.submit.resourcePath': { fieldId: 'http.submit.resourcePath' },
    'http.status.doneValues': { fieldId: 'http.status.doneValues' },
    'http.result._exportId': { fieldId: 'http.result._exportId' },
    'http.submit.sameAsStatus': { fieldId: 'http.submit.sameAsStatus' },
    'http.submit.transform': { fieldId: 'http.submit.transform' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: false,
        label: 'General',
        fields: ['name'],
      },
      {
        collapsed: false,
        label: 'Configure how to check status',
        fields: ['http.status._exportId',
          'http.status.initialWaitTime',
          'http.status.pollWaitTime',
          'http.status.statusPath',
          'http.status.inProgressValues',
          'http.status.doneValues',
          'http.status.doneWithoutDataValues'],
      },
      {
        collapsed: false,
        label: 'Configure how to get the results',
        fields: ['http.result._exportId'],
      },
      {
        collapsed: false,
        label: 'Configure how to process initial submission',
        fields: ['http.submit.sameAsStatus',
          'http.submit.resourcePath',
          'http.submit.transform'],
      },
    ],
  },
};

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
    'http.status._exportId': { fieldId: 'http.status._exportId' },
    'http.status.initialWaitTime': { fieldId: 'http.status.initialWaitTime' },
    'http.status.pollWaitTime': { fieldId: 'http.status.pollWaitTime' },
    'http.status.statusPath': { fieldId: 'http.status.statusPath' },
    'http.status.inProgressValues': { fieldId: 'http.status.inProgressValues' },
    'http.status.doneWithoutDataValues': {
      fieldId: 'http.status.doneWithoutDataValues',
    },
    statusExport: {
      fieldId: 'statusExport',
      type: 'labeltitle',
      label: 'Status Export',
    },
    submit: {
      fieldId: 'submit',
      type: 'labeltitle',
      label: 'Submit',
    },
    result: {
      fieldId: 'result',
      type: 'labeltitle',
      label: 'Result',
    },
    'http.submit.resourcePath': { fieldId: 'http.submit.resourcePath' },
    'http.status.doneValues': { fieldId: 'http.status.doneValues' },
    'http.result._exportId': { fieldId: 'http.result._exportId' },
    'http.submit.sameAsStatus': { fieldId: 'http.submit.sameAsStatus' },
    'http.submit.transform': { fieldId: 'http.submit.transform' },
  },
  layout: {
    fields: [
      'name',
      'statusExport',
      'http.status._exportId',
      'http.status.initialWaitTime',
      'http.status.pollWaitTime',
      'http.status.statusPath',
      'http.status.inProgressValues',
      'http.status.doneValues',
      'http.status.doneWithoutDataValues',
      'submit',
      'http.submit.sameAsStatus',
      'http.submit.resourcePath',
      'http.submit.transform',
      'result',
      'http.result._exportId',
    ],
  },
};

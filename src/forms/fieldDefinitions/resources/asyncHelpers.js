export default {
  'http.status._exportId': {
    label: 'Status export',
    type: 'selectresource',
    options: { appType: 'http' },
    appTypeIsStatic: true,
    resourceType: 'exports',
    filter: r => ({ _connectionId: r._connectionId }),
    statusExport: true,
    allowNew: true,
    allowEdit: true,
    required: true,
  },
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  'http.status.initialWaitTime': {
    type: 'text',
    label: 'Initial wait time',
  },
  'http.status.pollWaitTime': {
    type: 'text',
    label: 'Poll wait time',
  },
  'http.status.statusPath': {
    type: 'text',
    label: 'Status path',
    required: true,
  },
  'http.status.inProgressValues': {
    type: 'text',
    label: 'In progress values',
    required: true,
  },
  'http.status.doneValues': {
    type: 'text',
    label: 'Done values',
    required: true,
  },
  'http.status.doneWithoutDataValues': {
    type: 'text',
    label: 'Done without data values',
  },
  'http.submit.resourcePath': {
    type: 'text',
    visibleWhen: [
      {
        field: 'http.submit.sameAsStatus',
        isNot: [true],
      },
    ],
    label: 'Submit resource path',
  },
  'http.result._exportId': {
    type: 'selectresource',
    resourceType: 'exports',
    allowNew: true,
    allowEdit: true,
    appTypeIsStatic: true,
    statusExport: true,
    options: { appType: 'http' },
    filter: r => ({ _connectionId: r._connectionId }),
    required: true,
    label: 'Result export',
  },
  'http.submit.sameAsStatus': {
    type: 'checkbox',
    label: 'Same as status export',
  },
  rules: {
    type: 'text',
    label: 'Transform rules for submit response',
  },
};

export default {
  'http.status._exportId': {
    label: 'Status Export',
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
    label: 'Initial Wait Time',
  },
  'http.status.pollWaitTime': {
    type: 'text',
    label: 'Poll Wait Time',
  },
  'http.status.statusPath': {
    type: 'text',
    label: 'Status Path',
    required: true,
  },
  'http.status.inProgressValues': {
    type: 'text',
    label: 'In Progress Values',
    required: true,
  },
  'http.status.doneValues': {
    type: 'text',
    label: 'Done Values',
    required: true,
  },
  'http.status.doneWithoutDataValues': {
    type: 'text',
    label: 'Done Without Data Values',
  },
  'http.submit.resourcePath': {
    type: 'text',
    visibleWhen: [
      {
        field: 'http.submit.sameAsStatus',
        isNot: [true],
      },
    ],
    label: 'Submit Resource Path',
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
    label: 'Result Export',
  },
  'http.submit.sameAsStatus': {
    type: 'checkbox',
    label: 'Same As Status Export',
  },
  rules: {
    type: 'text',
    label: 'Transform Rules for Submit Response',
  },
};

import { isNewId } from '../../../utils/resource';

export default {
  'http.status._exportId': {
    loggable: true,
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
    loggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    loggable: true,
    type: 'text',
    label: 'Description',
    defaultValue: r => r.description || '',
  },
  'http.status.initialWaitTime': {
    loggable: true,
    type: 'text',
    label: 'Initial wait time',
  },
  'http.status.pollWaitTime': {
    loggable: true,
    type: 'text',
    label: 'Poll wait time',
  },
  'http.status.statusPath': {
    loggable: true,
    type: 'text',
    label: 'Status path',
    required: true,
  },
  'http.status.inProgressValues': {
    type: 'textlist',
    label: 'In progress values',
    required: true,
  },
  'http.status.doneValues': {
    type: 'textlist',
    label: 'Done values',
    required: true,
  },
  'http.status.doneWithoutDataValues': {
    type: 'textlist',
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
    label: 'Resource path',
  },
  'http.result._exportId': {
    loggable: true,
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
    loggable: true,
    type: 'checkbox',
    label: 'Same as check status',
    defaultValue: r => isNewId(r?._id) ? true : r?.http?.submit?.sameAsStatus,
  },
  'http.submit.transform': {
    type: 'transformrules',
    label: 'Transform rules',
    visibleWhen: [
      {
        field: 'http.submit.sameAsStatus',
        isNot: [true],
      },
    ],
  },
};

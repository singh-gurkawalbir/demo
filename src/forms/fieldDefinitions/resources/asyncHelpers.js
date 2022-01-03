import { isNewId } from '../../../utils/resource';
import { isIntegrationApp } from '../../../utils/flows';

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
    defaultDisabled: r => isIntegrationApp(r),
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
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.pollWaitTime': {
    loggable: true,
    type: 'text',
    label: 'Poll wait time',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.statusPath': {
    loggable: true,
    type: 'text',
    label: 'Status path',
    required: true,
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.inProgressValues': {
    loggable: true,
    type: 'textlist',
    label: 'In progress values',
    required: true,
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.doneValues': {
    loggable: true,
    type: 'textlist',
    label: 'Done values',
    required: true,
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.doneWithoutDataValues': {
    loggable: true,
    type: 'textlist',
    label: 'Done without data values',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.errorValues': {
    loggable: true,
    type: 'textlist',
    label: 'Error values',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.submit.resourcePath': {
    loggable: true,
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
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.submit.sameAsStatus': {
    loggable: true,
    type: 'checkbox',
    label: 'Same as check status',
    defaultValue: r => isNewId(r?._id) ? true : r?.http?.submit?.sameAsStatus,
  },
  'http.submit.transform': {
    loggable: true,
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

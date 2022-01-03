import { isNewId } from '../../../utils/resource';
import { isIntegrationApp } from '../../../utils/flows';

export default {
  'http.status._exportId': {
    isLoggable: true,
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
    isLoggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    isLoggable: true,
    type: 'text',
    label: 'Description',
    defaultValue: r => r.description || '',
  },
  'http.status.initialWaitTime': {
    isLoggable: true,
    type: 'text',
    label: 'Initial wait time',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.pollWaitTime': {
    isLoggable: true,
    type: 'text',
    label: 'Poll wait time',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.statusPath': {
    isLoggable: true,
    type: 'text',
    label: 'Status path',
    required: true,
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.inProgressValues': {
    isLoggable: true,
    type: 'textlist',
    label: 'In progress values',
    required: true,
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.doneValues': {
    isLoggable: true,
    type: 'textlist',
    label: 'Done values',
    required: true,
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.doneWithoutDataValues': {
    isLoggable: true,
    type: 'textlist',
    label: 'Done without data values',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.status.errorValues': {
    isLoggable: true,
    type: 'textlist',
    label: 'Error values',
    defaultDisabled: r => isIntegrationApp(r),
  },
  'http.submit.resourcePath': {
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
    type: 'checkbox',
    label: 'Same as check status',
    defaultValue: r => isNewId(r?._id) ? true : r?.http?.submit?.sameAsStatus,
  },
  'http.submit.transform': {
    isLoggable: true,
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

import moment from 'moment';
import { isNewId } from '../../../utils/resource';

export default {
  expires: {
    loggable: true,
    defaultValue: r => r.expires && moment(r.expires).format('L'),
    type: 'licenseexpires',
    label: 'Expires',
    connectorId: r => r._connectorId,
  },
  trialEndDate: {
    loggable: true,
    defaultValue: r => r.trialEndDate && moment(r.trialEndDate).format('L'),
    type: 'licenseexpires',
    label: 'Trial expires',
    connectorId: r => r._connectorId,
  },
  opts: {
    loggable: true,
    defaultValue: r => r.opts,
    type: 'licenseeditor',
    mode: 'json',
    label: 'Options',
  },
  sandbox: {
    loggable: true,
    type: 'select',
    label: 'Environment',
    defaultValue: r => r.sandbox ? 'true' : 'false',
    required: true,
    options: [
      {
        items: [
          { label: 'Production', value: 'false' },
          { label: 'Sandbox', value: 'true' },
        ],
      },
    ],
    defaultDisabled: r => !isNewId(r._id),
  },
  email: {
    defaultValue: r => r.user?.email || r.email,
    type: 'text',
    label: 'Email',
    required: true,
    disableText: r => !isNewId(r._id) || r.trialLicenseTemplate,
  },
  _editionId: {
    loggable: true,
    type: 'licenseedition',
    label: 'Edition',
    defaultDisabled: r => !isNewId(r._id) && !!r._integrationId,
    connectorId: r => r?._connectorId,
  },
  childLicenses: {
    loggable: true,
    type: 'childlicenses',
    label: 'Child licenses',
    connectorId: r => r._connectorId,
    visible: r => !isNewId(r._id),
  },
};

import moment from 'moment';
import { isNewId } from '../../../utils/resource';

export default {
  expires: {
    defaultValue: r => r.expires && moment(r.expires).format('L'),
    type: 'licenseexpires',
    label: 'Expires',
    connectorId: r => r._connectorId,
    trialLicenseTemplate: r => r.trialLicenseTemplate,
  },
  trialEndDate: {
    defaultValue: r => r.trialEndDate && moment(r.trialEndDate).format('L'),
    type: 'licenseexpires',
    label: 'Trial expires',
    connectorId: r => r._connectorId,
    trialLicenseTemplate: r => r.trialLicenseTemplate,
  },
  opts: {
    defaultValue: r => r.opts,
    type: 'editor',
    mode: 'json',
    saveMode: 'json',
    label: 'Options',
  },
  sandbox: {
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
    defaultValue: r => r.user && r.user.email,
    type: 'text',
    label: 'Email',
    required: true,
    disableText: r => !isNewId(r._id),
  },
  _editionId: {
    type: 'licenseedition',
    label: 'Edition',
    required: true,
    connectorId: r => r?._connectorId,
  },
  childLicenses: {
    type: 'childlicenses',
    label: 'Child licenses',
    connectorId: r => r._connectorId,
    visible: r => !isNewId(r._id),
  },
};

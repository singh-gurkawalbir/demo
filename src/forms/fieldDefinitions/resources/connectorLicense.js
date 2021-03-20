import moment from 'moment';
import { isNewId } from '../../../utils/resource';

export default {
  expires: {
    defaultValue: r => r.expires && moment(r.expires).format('L'),
    type: 'dateselector',
    label: 'Expires',
    connectorId: r => r._connectorId,
  },
  trialEndDate: {
    defaultValue: r => r.expires && moment(r.trialEndDate).format('L'),
    type: 'dateselector',
    label: 'Trial expires',
    connectorId: r => r._connectorId,
    hideifnottrial: true,
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
  edition: {
    type: 'text',
    label: 'Edition',
  },
  childLicenses: {
    type: 'childlicenses',
    label: 'Child licenses',
    connectorId: r => r._connectorId,
    visible: r => !isNewId(r._id),
  },
};

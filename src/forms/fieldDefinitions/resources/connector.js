import { connectorsList } from '../../../constants/applications';
import { isNewId } from '../../../utils/resource';
import { MULTIPLE_EMAILS, ABS_URL_VALIDATION_PATTERN } from '../../../utils/constants';

export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  websiteURL: {
    type: 'text',
    label: 'Website URL',
    validWhen: {
      matchesRegEx: {
        pattern: ABS_URL_VALIDATION_PATTERN,
        message: 'Please enter a valid URL.',
      },
    },
  },
  contactEmail: {
    type: 'text',
    label: 'Contact emails',
    required: true,
    placeholder: 'Comma separated list of emails',
    validWhen: {
      matchesRegEx: {
        pattern: MULTIPLE_EMAILS,
        message: 'Please enter a valid Email.',
      },
    },
  },
  framework: {
    type: 'text',
    label: 'Framework',
    defaultValue: r => (isNewId(r._id) || r.framework === 'twoDotZero') ? 'twoDotZero' : '',
    visible: false,
  },
  installerFunction: {
    type: 'text',
    label: 'Installer function',
    requiredWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
    visibleWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
  },
  _integrationId: {
    type: 'selectresource',
    label: 'Source integration',
    placeholder: 'Choose integration',
    resourceType: 'integrations',
    filter: () => ({
      _connectorId: { $exists: false },
      _templateId: { $exists: false },
    }),
    requiredWhen: [
      {
        field: 'framework',
        is: ['twoDotZero'],
      },
    ],
    visibleWhen: [
      {
        field: 'framework',
        is: ['twoDotZero'],
      },
    ],
  },
  _stackId: {
    type: 'selectresource',
    label: 'Stack',
    resourceType: 'stacks',
    requiredWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
    visibleWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
  },
  uninstallerFunction: {
    type: 'text',
    label: 'Uninstaller function',
    required: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
    visibleWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
  },
  updateFunction: {
    type: 'text',
    label: 'Update function',
    requiredWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
    visibleWhen: [
      {
        field: 'framework',
        isNot: ['twoDotZero'],
      },
    ],
  },
  applications: {
    type: 'selectmultiapplication',
    placeholder: 'Choose applications',
    label: 'Applications',
    defaultValue: r => (r?.applications) || [],
    requiredWhen: [
      {
        field: 'framework',
        is: ['twoDotZero'],
      },
    ],
    options: [
      {
        items: connectorsList(),
      },
    ],
  },
  trialEnabled: {
    type: 'checkbox',
    label: 'Enable trials',
    defaultDisabled: r => isNewId(r._id),
    helpKey: 'license.trialEnabled',
  },
  trialPeriod: {
    type: 'select',
    label: 'Trial period',
    defaultValue: r => r?.trialPeriod || 30,
    options: [
      {
        items: [
          { label: '14 days', value: 14 },
          { label: '30 days', value: 30 },
          { label: '60 days', value: 60 },
        ],
      },
    ],
  },
  _trialLicenseId: {
    type: 'triallicense',
    label: 'Trial license template',
    resourceType: 'connectorLicenses',
    allowNew: true,
    allowEdit: true,
    helpKey: 'license._trialLicenseId',
    connectorId: r => r._id,
  },
};

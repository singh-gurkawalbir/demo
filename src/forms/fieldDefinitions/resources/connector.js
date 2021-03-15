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
};

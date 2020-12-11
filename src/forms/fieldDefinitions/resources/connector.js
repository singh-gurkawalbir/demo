// Regular Expression to Simple multiple email addresses separated by commas from regextester.com

import { connectorsList } from '../../../constants/applications';

const MULTIPLE_EMAILS = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;

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
  imageURL: {
    type: 'text',
    label: 'Image URL',
    required: true,
  },
  websiteURL: {
    type: 'text',
    label: 'Website URL',
    validWhen: {
      matchesRegEx: {
        pattern:
          "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
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
  installerFunction: {
    type: 'text',
    label: 'Installer function',
    required: true,
  },
  _stackId: {
    type: 'selectresource',
    label: 'Stack',
    resourceType: 'stacks',
    required: true,
  },
  uninstallerFunction: {
    type: 'text',
    label: 'Uninstaller function',
    required: true,
  },
  updateFunction: {
    type: 'text',
    label: 'Update function',
    required: true,
  },
  applications: {
    type: 'multiselect',
    label: 'Applications',
    valueDelimiter: ',',
    defaultValue: r => (r?.applications) || [],
    options: [
      {
        items: connectorsList(),
      },
    ],
  },
};

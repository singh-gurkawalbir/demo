import { templatesList } from '../../../constants/applications';

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
        pattern:
          "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
        message: 'Please enter a valid URL.',
      },
    },
  },
  contactEmail: {
    type: 'text',
    label: 'Contact emails',
  },
  installerFunction: {
    type: 'text',
    label: 'Installer function',
  },
  applications: {
    type: 'selectmultiapplication',
    placeholder: 'Choose applications',
    label: 'Applications',
    valueDelimiter: ',',
    defaultValue: r => (r?.applications) || [],
    options: [
      {
        items: templatesList(),
      },
    ],
  },
};

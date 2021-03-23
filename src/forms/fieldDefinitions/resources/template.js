import { templatesList } from '../../../constants/applications';
import { ABS_URL_VALIDATION_PATTERN } from '../../../utils/constants';

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

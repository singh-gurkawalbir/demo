import { templatesList } from '../../../constants/applications';
import { ABS_URL_VALIDATION_PATTERN } from '../../../utils/constants';

export default {
  name: {
    loggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    loggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  websiteURL: {
    loggable: true,
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
    loggable: true,
    type: 'text',
    label: 'Installer function',
  },
  applications: {
    loggable: true,
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

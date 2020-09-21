import { applicationsList } from '../../../constants/templates';

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
  },
  websiteURL: {
    type: 'text',
    label: 'Website URL',
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
    type: 'multiselect',
    label: 'Applications',
    valueDelimiter: ',',
    defaultValue: r => (r?.applications) || [],
    options: [
      {
        items: applicationsList(),
      },
    ],
  },
};

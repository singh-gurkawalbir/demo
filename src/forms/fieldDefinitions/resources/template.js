import { templateList } from '../../../views/TemplateList/util';

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
    label: 'Contact Emails',
  },
  installerFunction: {
    type: 'text',
    label: 'Installer Function',
  },
  applications: {
    type: 'multiselect',
    label: 'Applications',
    valueDelimiter: ',',
    options: [
      {
        items: templateList,
      },
    ],
  },
};

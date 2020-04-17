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
    label: 'Image url',
  },
  websiteURL: {
    type: 'text',
    label: 'Website url',
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
    options: [
      {
        items: templateList,
      },
    ],
  },
};

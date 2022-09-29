import { getPublishedHttpConnectors, templatesList } from '../../../constants/applications';
import { ABS_URL_VALIDATION_PATTERN } from '../../../constants';

export default {
  name: {
    isLoggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    isLoggable: true,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  websiteURL: {
    isLoggable: true,
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
    isLoggable: true,
    type: 'text',
    label: 'Installer function',
  },
  applications: {
    isLoggable: true,
    type: 'selectmultiapplication',
    placeholder: 'Choose applications',
    label: 'Applications',
    valueDelimiter: ',',
    defaultValue: r => {
      const applications = (r?.applications) || [];
      const publishedConnectors = getPublishedHttpConnectors();

      return applications.map(app => {
        const publishedConnectorName = publishedConnectors?.find(pc => pc._id === app)?.name;

        return publishedConnectorName || app;
      });
    },
    options: [
      {
        items: templatesList(),
      },
    ],
  },
};

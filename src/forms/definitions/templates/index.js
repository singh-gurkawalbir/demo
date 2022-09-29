import { getPublishedHttpConnectors } from '../../../constants/applications';

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    const applications = formValues['/applications'];

    const publishedConnectors = getPublishedHttpConnectors();

    newValues['/applications'] = applications.map(app => {
      const publishedConnectorId = publishedConnectors?.find(pc => pc.name === app)?._id;

      return publishedConnectorId || app;
    });

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    applications: { fieldId: 'applications' },
    contactEmail: { fieldId: 'contactEmail' },
    websiteURL: { fieldId: 'websiteURL' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: [
          'name',
          'description',
          'applications',
          'contactEmail',
          'websiteURL',
        ],
      },
    ],
  },
};

import { getPublishedConnectorId } from '../../../utils/assistant';

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    const applications = formValues['/applications'];

    newValues['/applications'] = applications.map(app => getPublishedConnectorId(app) || app);

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

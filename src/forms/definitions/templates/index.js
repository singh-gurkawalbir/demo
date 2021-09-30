export default {
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

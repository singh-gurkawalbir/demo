export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    websiteURL: { fieldId: 'websiteURL' },
    contactEmail: { fieldId: 'contactEmail' },
    applications: { fieldId: 'applications' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: [
          'name',
          'description',
          'websiteURL',
          'contactEmail',
          'applications',
        ],
      },
    ],
  },
};

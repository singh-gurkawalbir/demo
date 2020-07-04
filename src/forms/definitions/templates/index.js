export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    imageURL: { fieldId: 'imageURL' },
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
          'imageURL',
          'websiteURL',
          'contactEmail',
          'applications',
        ],
      },
    ],
  },
};

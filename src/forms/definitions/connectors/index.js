export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    imageURL: { fieldId: 'imageURL' },
    websiteURL: { fieldId: 'websiteURL' },
    contactEmail: { fieldId: 'contactEmail' },
    _stackId: { fieldId: '_stackId' },
    installerFunction: { fieldId: 'installerFunction' },
    uninstallerFunction: { fieldId: 'uninstallerFunction' },
    updateFunction: { fieldId: 'updateFunction' },
    applications: { fieldId: 'applications' },
  },
  layout: {
    fields: [
      'name',
      'description',
      'imageURL',
      'websiteURL',
      'contactEmail',
      '_stackId',
      'installerFunction',
      'uninstallerFunction',
      'updateFunction',
      'applications',
    ],
  },
};

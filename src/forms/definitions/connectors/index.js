export default {
  preSave: formValues => {
    if (formValues['/framework'] === 'twoDotZero') {
      const twoDotZero = {
        _integrationId: formValues['/_integrationId'],
        editions: formValues['/editions'],
      };
      const newValues = {
        ...formValues,
        '/twoDotZero': twoDotZero,
      };

      delete newValues['/editions'];

      return newValues;
    }

    return formValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    applications: { fieldId: 'applications' },
    _integrationId: { fieldId: '_integrationId' },
    contactEmail: { fieldId: 'contactEmail' },
    websiteURL: { fieldId: 'websiteURL' },
    editions: { fieldId: 'editions' },
    _stackId: { fieldId: '_stackId' },
    installerFunction: { fieldId: 'installerFunction' },
    uninstallerFunction: { fieldId: 'uninstallerFunction' },
    updateFunction: { fieldId: 'updateFunction' },
    framework: { fieldId: 'framework' },
  },
  layout: {
    type: 'box',
    containers: [{
      fields: [
        'name',
        'description',
        'applications',
        '_integrationId',
        'contactEmail',
        'websiteURL',
        'editions',
        '_stackId',
        'installerFunction',
        'uninstallerFunction',
        'updateFunction',
        'framework',
      ],
    }],
  },
};

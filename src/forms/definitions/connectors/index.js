export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    if (!newValues['/trialEnabled']) {
      newValues['/trialPeriod'] = undefined;
      newValues['/_trialLicenseId'] = undefined;
    }

    if (formValues['/framework'] === 'twoDotZero') {
      const twoDotZero = {
        _integrationId: formValues['/_integrationId'],
      };

      const newValues = {
        ...formValues,
        '/twoDotZero': twoDotZero,
      };

      delete newValues['/editions'];

      return newValues;
    }

    return newValues;
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
    trialEnabled: { fieldId: 'trialEnabled' },
    trialPeriod: {
      fieldId: 'trialPeriod',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'trialEnabled', is: [true] }],
      requiredWhen: [{ field: 'trialEnabled', is: [true] }],

    },
    _trialLicenseId: {
      fieldId: '_trialLicenseId',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'trialEnabled', is: [true] }],
      requiredWhen: [{ field: 'trialEnabled', is: [true] }],
    },
  },
  layout: {
    type: 'collapse',
    containers: [{
      collapsed: true,
      label: 'General',
      fields: [
        'name',
        'description',
        'applications',
        '_integrationId',
        'contactEmail',
        'websiteURL',
        '_stackId',
        'installerFunction',
        'uninstallerFunction',
        'updateFunction',
        'framework',
      ],
    }, {
      collapsed: true,
      label: 'Trials',
      fields: [
        'trialEnabled',
        'trialPeriod',
        '_trialLicenseId',
      ],
    }],
  },
};

import { getPublishedConnectorId } from '../../../utils/assistant';

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    const applications = formValues['/applications'];

    newValues['/applications'] = applications.map(app => getPublishedConnectorId(app) || app);

    if (formValues['/framework'] === 'twoDotZero') {
      newValues['/twoDotZero/_integrationId'] = newValues['/_integrationId'];

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
      removedWhen: [{ field: 'trialEnabled', is: [''] }],
    },
    _trialLicenseId: {
      fieldId: '_trialLicenseId',
      omitWhenHidden: true,
      visibleWhen: [{ field: 'trialEnabled', is: [true] }],
      requiredWhen: [{ field: 'trialEnabled', is: [true] }],
      removedWhen: [{ field: 'trialEnabled', is: [''] }],
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

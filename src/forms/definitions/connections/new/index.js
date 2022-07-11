import {applicationsList, applicationsPlaceHolderText} from '../../../../constants/applications';

export default {
  preSave: ({ application, ...rest }) => {
    const applications = applicationsList();

    const app = applications.find(a => a.id === application) || {};
    const appType = app.type === 'rest' ? 'http' : app.type;
    const newValues = {
      ...rest,
      '/adaptorType': `${appType.toUpperCase()}Connection`,
      '/type': appType,
      '/application': app.name,
      '/_httpConnectorId': app._httpConnectorId,
    };

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    return newValues;
  },
  fieldMap: {
    application: {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      label: 'Application',
      isLoggable: true,
      placeholder: applicationsPlaceHolderText(),
      defaultValue: '',
      required: true,
      validWhen: {
        isNot: { values: [''], message: 'Please select an application' },
      },
    },
  },
  layout: {
    fields: ['application'],
  },
};

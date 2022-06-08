import {applicationsList, applicationsPlaceHolderText, getPublishedHttpConnectorThroughAssistant} from '../../../../constants/applications';

export default {
  preSave: ({ application, ...rest }) => {
    const applications = applicationsList();

    const app = applications.find(a => a.id === application) || {};
    const connector = getPublishedHttpConnectorThroughAssistant(application);
    const newValues = {
      ...rest,
      '/adaptorType': `${app.type.toUpperCase()}Connection`,
      '/type': connector?._id ? 'http' : app.type,
      '/application': app.name,
      '/_httpConnectorId': connector?._id,
    };

    if (app.assistant && !connector?._id) {
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

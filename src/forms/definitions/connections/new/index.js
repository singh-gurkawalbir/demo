import {applicationsList, applicationsPlaceHolderText} from '../../../../constants/applications';

export default {
  preSave: ({ application, httpConnector, ...rest }) => {
    const applications = applicationsList();

    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${app.type.toUpperCase()}Connection`,
      '/type': app.type,
      '/application': app.name,
    };

    // if (httpConnector) {
    //   const connectionTemplate = httpConnector.versions[0].supportedBy.connection;

    //   if (connectionTemplate) {
    //     const settingsForm = connectionTemplate.preConfiguredFields.find(fields => fields.path === 'settingsForm');

    //     if (settingsForm) {
    //       newValues['/settingsForm'] = {form: {...settingsForm.values[0]}};
    //     }
    //   }
    // }

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

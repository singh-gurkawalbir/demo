import {applicationsList, applicationsPlaceHolderText} from '../../../../constants/applications';

export default {
  preSave: ({ application, name, ...rest }) => {
    const applications = applicationsList();

    let app = applications.find(a => a.id === application) || {};
    let httpConnectorId = app._httpConnectorId;

    if (app._httpConnectorId && name && applications.find(a => a.name === name)?._httpConnectorId) {
      app = applications.find(a => a.name === name) || {};
      // If it has multiple local connectors, right httpConnectorId should be picked
      httpConnectorId = app._httpConnectorId || httpConnectorId;
    }
    const appType = (app.type === 'rest' && !app.assistant) ? 'http' : app.type;
    const newValues = {
      ...rest,
      '/adaptorType': `${appType.toUpperCase()}Connection`,
      '/type': appType,
      '/application': app.name,
      '/_httpConnectorId': httpConnectorId
      ,
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
      helpKey: 'application',
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
    type: 'box',
    containers: [
      {
        fields: ['application'],
      },
    ],
  },
};

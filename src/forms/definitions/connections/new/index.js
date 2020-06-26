import {applicationsList} from '../../../../constants/applications';


export default {
  preSave: ({ application, ...rest }) => {
    const applications = applicationsList();

    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${app.type.toUpperCase()}Connection`,
      '/type': app.type,
      '/aplication': app.name,
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
      placeholder:
        'Choose application or start typing to browse 150+ applications',
      defaultValue: '',
      required: true,
      validWhen: {
        isNot: { values: [''], message: 'Please select an application' },
      },
    },
    name: {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen: [
        {
          id: 'hasApp',
          field: 'application',
          isNot: [''],
        },
      ],
    },
  },
  layout: {
    fields: ['application', 'name'],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const applications = applicationsList();
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'name') {
      return `New ${app.name} Connection`;
    }

    return null;
  },
};

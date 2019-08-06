import applications from '../../../../constants/applications';

export default {
  preSubmit: ({ application, ...rest }) => {
    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${app.type.toUpperCase()}Connection`,
      '/type': app.type,
    };

    if (app.assistant) {
      newValues['/assistant'] = app.assistant;
    }

    return newValues;
  },
  fields: [
    {
      id: 'application',
      name: 'application',
      type: 'selectapplication',
      placeholder: 'Select application',
      defaultValue: '',
      required: true,
    },
    {
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
  ],
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'name') {
      return `New ${app.name} Connection`;
    }

    return null;
  },
};

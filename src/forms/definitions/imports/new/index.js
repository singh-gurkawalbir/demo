import applications from '../../../../constants/applications';

const visibleWhen = [
  {
    id: 'hasApp',
    field: 'application',
    isNot: [''],
  },
];

export default {
  preSubmit: ({ application, ...rest }) => {
    const app = applications.find(a => a.id === application) || {};
    const newValues = {
      ...rest,
      '/adaptorType': `${app.type.toUpperCase()}Import`,
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
      placeholder: 'Select application',
      defaultValue: '',
      required: true,
    },
    connection: {
      id: 'connection',
      name: '/_connectionId',
      type: 'selectresource',
      resourceType: 'connections',
      label: 'Connection',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen,
    },
    name: {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen,
    },
    description: {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhen,
    },
  },
  layout: {
    fields: ['application', 'connection', 'name', 'description'],
  },
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'name') {
      return `New ${app.name} Import`;
    }

    if (fieldId === 'connection') {
      const filter = { type: app.type };

      if (app.assistant) {
        filter.assistant = app.assistant;
      }

      return { filter };
    }

    return null;
  },
};

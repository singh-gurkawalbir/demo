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
      '/adaptorType': `${app.type.toUpperCase()}Export`,
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
      label: 'Application',
      defaultValue: '',
      required: true,
    },
    {
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
    {
      id: 'name',
      name: '/name',
      type: 'text',
      label: 'Name',
      defaultValue: '',
      required: true,
      refreshOptionsOnChangesTo: ['application'],
      visibleWhen,
    },
    {
      id: 'description',
      name: '/description',
      type: 'text',
      multiline: true,
      maxRows: 5,
      label: 'Description',
      defaultValue: '',
      visibleWhen,
    },
  ],
  optionsHandler: (fieldId, fields) => {
    const appField = fields.find(field => field.id === 'application');
    const app = applications.find(a => a.id === appField.value) || {};

    if (fieldId === 'name') {
      return `New ${app.name} Export`;
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

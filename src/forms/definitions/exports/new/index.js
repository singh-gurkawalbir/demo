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
    // TODO: Raghu, the below logic should move to a proper fn that uses a map.
    // This will only work for a select few adaptorTypes as others probably
    // dont follow the uppercase rule. we have a /utils/resource file that
    // should hold the map fn.
    const newValues = {
      ...rest,
      '/adaptorType':
        app.type === 'netsuite'
          ? 'NetSuiteExport'
          : `${app.type.toUpperCase()}Export`,
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

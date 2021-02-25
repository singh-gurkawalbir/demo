const meta = {
  fieldMap: {
    url: {
      id: 'url',
      name: 'url',
      type: 'relativeuri',
      helpText: 'Example of a custom input.',
      label: 'some url with handlebars support.',
    },
    A: {
      id: 'A',
      name: 'A',
      type: 'checkbox',
      label: 'Confirm delete..?',
    },
    body: {
      id: 'body',
      name: 'body',
      type: 'editor',
      mode: 'json',
      label: 'HTTP request body',
    },
    mode: {
      id: 'mode',
      name: 'mode',
      type: 'radiogroup',
      label: 'Mode of operation',
      options: [
        {
          items: ['Create', 'Update', 'Delete'],
        },
      ],
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        label: 'Basic Fields',
        fields: ['A', 'url'],
      },
      {
        label: 'Advanced Fields',
        fields: ['mode', 'body'],
      },
    ],
  },
};

export default {
  key: 'form-column',
  type: 'settingsForm',
  name: 'Multi-column',
  description: 'Example of a form spanning columns',
  data: JSON.stringify(meta, null, 2),
};

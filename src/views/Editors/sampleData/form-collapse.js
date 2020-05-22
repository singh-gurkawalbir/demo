const meta = {
  fieldMap: {
    url: {
      id: 'url',
      name: 'url',
      type: 'relativeuri',
      helpText: 'Example of a custom input.',
      label: 'some url with handlebar support.',
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
      type: 'text',
      multiline: true,
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
    type: 'collapse',
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
  key: 'form-collapse',
  mode: 'json',
  name: 'Collapsible form',
  data: JSON.stringify(meta, null, 2),
};

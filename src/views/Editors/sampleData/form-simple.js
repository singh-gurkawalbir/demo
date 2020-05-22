const sampleData = {
  fieldMap: {
    url: {
      id: 'url',
      name: 'url',
      type: 'relativeuri',
      helpText: 'example of a custom input.',
      label: 'some url with handlebar support.',
    },
    A: {
      id: 'A',
      name: 'A',
      type: 'checkbox',
      helpText: 'Optional help for setting: A',
      label: 'Confirm delete..?',
    },
    body: {
      id: 'body',
      name: 'body',
      type: 'text',
      multiline: true,
      helpText: 'Optional help for setting: A',
      label: 'HTTP request body',
      required: true,
      visibleWhen: [
        {
          field: 'mode',
          is: ['Update'],
        },
      ],
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
};

export default {
  key: 'form-simple',
  mode: 'json',
  name: 'Simple form',
  data: JSON.stringify(sampleData, null, 2),
};

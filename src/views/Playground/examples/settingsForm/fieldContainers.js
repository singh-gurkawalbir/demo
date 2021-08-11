const meta = {
  fieldMap: {
    keyValue: {
      id: 'keyValue',
      name: 'keyValue',
      type: 'keyvalue',
      keyName: 'theKey',
      valueName: 'theValue',
      showDelete: true,
      label: 'Key-value pairs',
      description: 'This input is used to collect a set of key-value pairs. The item delete action is optional and set using th showDelete prop. Also note that he key and value names can be configured as well.',
    },
    checkbox: {
      id: 'checkbox',
      name: 'checkbox',
      type: 'checkbox',
      label: 'Check me!',
    },
  },
  layout: {
    containers: [
      {
        type: 'indent',
        containers: [
          {
            label: 'Indented fields',
            fields: ['keyValue', 'checkbox'],
          },
        ],
      },
      {
        type: 'box',
        containers: [
          {
            label: 'Boxed fields',
            fields: ['keyValue', 'checkbox'],
          },
        ],
      },
      {
        type: 'collapse',
        containers: [
          {
            label: 'Collapsed fields',
            fields: ['keyValue', 'checkbox'],
          },
        ],
      },
    ],
  },
};

export default {
  key: 'field-containers',
  type: 'settingsForm',
  name: 'Field containers',
  description: 'Example of how fields can be grouped and presented within a form.',
  data: JSON.stringify(meta, null, 2),
};

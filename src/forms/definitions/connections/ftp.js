export default {
  // TODO: options handler forces a values when text field is empty
  // it should only do that when the user selects another protocol type
  // as well
  // The optionsHandler handler runs for every field
  fieldReferences: {
    name: { fieldId: 'name' },
    type: { fieldId: 'type', disabled: true },
    'ftp.hostURI': {
      fieldId: 'ftp.hostURI',
    },

    'ftp.type': { fieldId: 'ftp.type' },
    'ftp.username': {
      fieldId: 'ftp.username',
    },
  },
  containers: [
    {
      type: 'tab',
      fieldSets: [
        {
          label: 'first col',
          fields: ['name', 'ftp.username'],
          containers: [
            {
              type: 'collapse',
              fieldSets: [
                {
                  label: 'first col',
                  fields: ['name'],
                },
              ],
            },
            {
              type: 'collapse',
              fieldSets: [
                {
                  label: 'first col',
                  fields: ['ftp.username'],
                },
              ],
            },
          ],
        },
        {
          label: 'second col',
          fields: ['type'],
        },
        {
          label: 'third col',
          fields: ['ftp.hostURI'],
        },
      ],
    },
  ],
};

export default {
  // TODO: revert to older ftp connection meta...this is just to verify the new layout
  fieldReferences: {
    name: { fieldId: 'name' },
    type: { fieldId: 'type', disabled: true },
    'ftp.hostURI': {
      fieldId: 'ftp.hostURI',
      required: true,
    },
    'ftp.type': { fieldId: 'ftp.type' },
    'ftp.username': {
      fieldId: 'ftp.username',
    },
  },

  layout: {
    fields: ['ftp.username'],
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
                  {
                    label: 'second col',
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
  },
};

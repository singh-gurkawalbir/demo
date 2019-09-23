export default {
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    fileType: { formId: 'fileType' },
    's3.fileKey': { fieldId: 's3.fileKey' },
    file: { formId: 'file' },
    dataMappings: { formId: 'dataMappings' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
    hooks: { formId: 'hooks' },
    'hooks.postAggregate.function': { fieldId: 'hooks.postAggregate.function' },
    'hooks.postAggregate._scriptId': {
      fieldId: 'hooks.postAggregate._scriptId',
    },
    'hooks.postAggregate._stackId': { fieldId: 'hooks.postAggregate._stackId' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      's3.region',
      's3.bucket',
      'fileType',
      's3.fileKey',
      'file',
      'dataMappings',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['file.csv.rowDelimiter', 'fileAdvancedSettings'],
      },
      {
        collapsed: false,
        label: 'Hooks (Optional, Developers Only)',
        fields: [
          'hooks',
          'hooks.postAggregate.function',
          'hooks.postAggregate._scriptId',
          'hooks.postAggregate._stackId',
        ],
      },
    ],
  },
};

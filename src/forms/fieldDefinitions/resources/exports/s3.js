export default {
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    mode: r => r && r.file && r.file.type,
    visibleWhen: [
      {
        field: 'file.type',
        is: ['csv', 'xml', 'json', 'xlsx'],
      },
    ],
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
  },
  's3.region': {
    type: 'select',
    label: 'Region',
    required: true,
    options: [
      {
        items: [
          { label: 'Us-east-1', value: 'us-east-1' },
          { label: 'Us-east-2', value: 'us-east-2' },
          { label: 'Us-west-1', value: 'us-west-1' },
          { label: 'Us-west-2', value: 'us-west-2' },
          { label: 'Ca-central-1', value: 'ca-central-1' },
          { label: 'Ap-south-1', value: 'ap-south-1' },
          { label: 'Ap-northeast-2', value: 'ap-northeast-2' },
          { label: 'Ap-southeast-1', value: 'ap-southeast-1' },
          { label: 'Ap-southeast-2', value: 'ap-southeast-2' },
          { label: 'Ap-northeast-1', value: 'ap-northeast-1' },
          { label: 'Eu-central-1', value: 'eu-central-1' },
          { label: 'Eu-west-1', value: 'eu-west-1' },
          { label: 'Eu-west-2', value: 'eu-west-2' },
          { label: 'Sa-east-1', value: 'sa-east-1' },
          { label: 'Cn-north-1', value: 'cn-north-1' },
        ],
      },
    ],
  },
  's3.bucket': {
    type: 'text',
    label: 'Bucket Name',
    required: true,
  },
  's3.keyStartsWith': {
    type: 'text',
    label: 'Key Starts With',
  },
  's3.keyEndsWith': {
    type: 'text',
    label: 'Key Ends With',
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URI Template',
  },
};

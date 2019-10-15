export default {
  's3.region': {
    type: 'select',
    label: 'Region',

    defaultValue: r => r && r.s3 && r.s3.region,
    required: true,
    options: [
      {
        items: [
          { label: 'US East (N. Virginia) [us-east-1]', value: 'us-east-1' },
          { label: 'US West (N. California) [us-west-2]', value: 'us-west-1' },
          { label: 'US West (Oregon) [us-west-2]', value: 'us-west-2' },
          { label: 'EU (Ireland) [eu-west-1]', value: 'eu-west-1' },
          { label: 'EU (Frankfurt) [eu-central-1]', value: 'eu-central-1' },
          {
            label: 'Asia Pacific (Tokyo) [ap-northeast-1]',
            value: 'ap-northeast-1',
          },
          {
            label: 'Asia Pacific (Seoul) [ap-northeast-2]',
            value: 'ap-northeast-2',
          },
          {
            label: 'Asia Pacific (Singapore) [ap-southeast-1]',
            value: 'ap-southeast-1',
          },
          {
            label: 'Asia Pacific (Sydney) [ap-southeast-2]',
            value: 'ap-southeast-2',
          },
          {
            label: 'South America (São Paulo) [sa-east-1]',
            value: 'sa-east-1',
          },
          { label: 'China (Beijing) [cn-north-1]', value: 'cn-north-1' },
          { label: 'US East (Ohio) [us-east-2]', value: 'us-east-2' },
          { label: 'Canada (Central) [ca-central-1]', value: 'ca-central-1' },
          { label: 'Asia Pacific (Mumbai) [ap-south-1]', value: 'ap-south-1' },
          { label: 'EU (London) [eu-west-2]', value: 'eu-west-2' },
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

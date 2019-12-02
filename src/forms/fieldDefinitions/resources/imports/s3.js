export default {
  's3.region': {
    type: 'select',
    label: 'Region',
    required: true,
    options: [
      {
        items: [
          {
            label: 'US East (N. Virginia) [us-east-1]',
            value: 'us-east-1',
          },
          {
            label: 'US West (N. California) [us-west-1]',
            value: 'us-west-1',
          },
          {
            label: 'US West (Oregon) [us-west-2]',
            value: 'us-west-2',
          },
          {
            label: 'EU (Ireland) [eu-west-1]',
            value: 'eu-west-1',
          },
          {
            label: 'EU (Frankfurt) [eu-central-1]',
            value: 'eu-central-1',
          },
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
          {
            label: 'China (Beijing) [cn-north-1]',
            value: 'cn-north-1',
          },
          {
            label: 'US East (Ohio) [us-east-2]',
            value: 'us-east-2',
          },
          {
            label: 'Canada (Central) [ca-central-1]',
            value: 'ca-central-1',
          },
          {
            label: 'Asia Pacific (Mumbai) [ap-south-1]',
            value: 'ap-south-1',
          },
          {
            label: 'EU (London) [eu-west-2]',
            value: 'eu-west-2',
          },
        ],
      },
    ],
  },
  's3.bucket': {
    type: 'text',
    label: 'Bucket Name',
    placeholder: 'Enter S3 folder path,such as:MySite/Orders',
    required: true,
  },
  's3.fileKey': {
    type: 'autosuggest',
    label: 'File Key',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => (r && r.s3 && r.s3.fileKey) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type', 's3.fileKey'],
  },
};

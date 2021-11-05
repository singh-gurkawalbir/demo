import { URI_VALIDATION_PATTERN } from '../../../utils/constants';

export default {
  name: {
    canInstrument: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  type: {
    canInstrument: true,
    type: 'select',
    options: [
      {
        items: [
          { label: 'Server', value: 'server' },
          { label: 'AWS Lambda', value: 'lambda' },
        ],
      },
    ],
    label: 'Type',
  },
  'lambda.language': {
    canInstrument: true,
    type: 'select',
    options: [
      {
        items: [
          { label: 'Node.js', value: 'Node.js' },
          { label: 'C#', value: 'C#' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
    defaultValue: r => (r && r.lambda && r.lambda.language) || 'Node.js',
    label: 'Language',
  },
  'server.hostURI': {
    type: 'text',
    label: 'Host',
    required: true,
    visibleWhen: [
      {
        field: 'type',
        is: ['server'],
      },
    ],
    validWhen: {
      matchesRegEx: {
        pattern: URI_VALIDATION_PATTERN,
        message: 'Please enter a valid URI.',
      },
    },
  },
  'lambda.accessKeyId': {
    type: 'text',
    label: 'Access key ID',
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
  'lambda.secretAccessKey': {
    type: 'text',
    label: 'Secret access key',
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
  'lambda.awsRegion': {
    canInstrument: false,
    type: 'select',
    label: 'AWS region',
    options: [
      {
        items: [
          { label: 'US East (N.Virginia) [us-east-1]', value: 'us-east-1' },
          { label: 'US West (Oregon) [us-west-2]', value: 'us-west-2' },
          {
            label: 'Asia Pacific (Singapore) [ap-southeast-1]',
            value: 'ap-southeast-1',
          },
          {
            label: 'Asia Pacific (Sydney) [ap-southeast-2]',
            value: 'ap-southeast-2',
          },
          {
            label: 'Asia Pacific (Tokyo) [ap-northeast-1]',
            value: 'ap-northeast-1',
          },
          { label: 'Eu (Frankfurt) [eu-central-1]', value: 'eu-central-1' },
          { label: 'Eu (Ireland) [eu-west-1]', value: 'eu-west-1' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
  'lambda.functionName': {
    canInstrument: true,
    type: 'text',
    label: 'Function name',
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
};

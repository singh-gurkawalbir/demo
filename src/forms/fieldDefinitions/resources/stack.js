import { URI_VALIDATION_PATTERN } from '../../../utils/constants';

export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  type: {
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
  'server.hostURI': {
    type: 'text',
    label: 'Host',
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
    label: 'Access Key Id',
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
  'lambda.secretAccessKey': {
    type: 'text',
    label: 'Secret Acess Key',
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
  'lambda.awsRegion': {
    type: 'select',
    label: 'AWS Region',
    options: [
      {
        items: [
          { label: 'US East (N.Virginia) [us-east-1]', value: 'us-east-1' },
          { label: 'US West (Oregon) [us-east-2]', value: 'us-west-2' },
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
    type: 'text',
    label: 'Function Name',
    visibleWhen: [
      {
        field: 'type',
        is: ['lambda'],
      },
    ],
  },
};

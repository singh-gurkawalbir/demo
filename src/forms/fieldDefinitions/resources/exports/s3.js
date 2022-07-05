import { AWS_REGIONS_LIST } from '../../../../utils/constants';

export default {
  's3.region': {
    isLoggable: true,
    type: 'select',
    label: 'Region',
    required: true,
    defaultValue: r => r?.s3?.region || 'us-east-1',
    options: [
      {
        items: AWS_REGIONS_LIST,
      },
    ],
  },
  's3.bucket': {
    isLoggable: true,
    type: 'uri',
    label: 'Bucket name',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  's3.keyStartsWith': {
    isLoggable: true,
    type: 'uri',
    label: 'Key starts with',
    showExtract: false,
    showLookup: false,
  },
  's3.keyEndsWith': {
    isLoggable: true,
    type: 'uri',
    label: 'Key ends with',
    showExtract: false,
    showLookup: false,
  },
};

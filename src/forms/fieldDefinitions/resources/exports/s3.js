import { AWS_REGIONS_LIST } from '../../../../utils/constants';

export default {
  's3.region': {
    loggable: true,
    type: 'select',
    label: 'Region',
    required: true,
    options: [
      {
        items: AWS_REGIONS_LIST,
      },
    ],
  },
  's3.bucket': {
    loggable: true,
    type: 'uri',
    label: 'Bucket name',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  's3.keyStartsWith': {
    loggable: true,
    type: 'uri',
    label: 'Key starts with',
    showExtract: false,
    showLookup: false,
  },
  's3.keyEndsWith': {
    loggable: true,
    type: 'uri',
    label: 'Key ends with',
    showExtract: false,
    showLookup: false,
  },
};

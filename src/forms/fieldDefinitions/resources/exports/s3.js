import { AWS_REGIONS_LIST } from '../../../../utils/constants';

export default {
  's3.region': {
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
    type: 'text',
    label: 'Bucket name',
    required: true,
  },
  's3.keyStartsWith': {
    type: 'text',
    label: 'Key starts with',
  },
  's3.keyEndsWith': {
    type: 'text',
    label: 'Key ends with',
  },
};

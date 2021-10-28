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
    type: 'uri',
    stage: 'importMappingExtract',
    label: 'Bucket name',
    placeholder: 'Enter S3 folder path,such as:MySite/Orders',
    required: true,
    showExtract: false,
    showLookup: false,
  },
};

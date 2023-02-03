import { AWS_REGIONS_LIST } from '../../../../constants';

export default {
  's3.region': {
    isLoggable: true,
    type: 'select',
    label: 'Region',
    required: true,
    defaultValue: r => r.s3?.region || 'us-east-1',
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
    placeholder: 'Enter S3 folder path,such as:MySite/Orders',
    required: true,
    showExtract: false,
    showLookup: false,
  },
  's3.serverSideEncryptionType': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Use server-side encryption (SSE-S3)',
    defaultValue: r => !!r.s3?.serverSideEncryptionType,
    helpKey: () => 'import.s3.serverSideEncryptionType',
  },
};

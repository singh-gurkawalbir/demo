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
    label: 'Bucket Name',
    placeholder: 'Enter S3 folder path,such as:MySite/Orders',
    required: true,
  },
  's3.fileKey': {
    type: 'timestampfilename',
    label: 'File Key',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => (r && r.s3 && r.s3.fileKey) || 'file-{{timestamp}}',
    refreshOptionsOnChangesTo: ['file.type'],
  },
};

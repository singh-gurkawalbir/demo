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
    type: 'namewitheditor',
    label: 'Bucket name',
    placeholder: 'Enter S3 folder path,such as:MySite/Orders',
    required: true,
  },
  's3.fileKey': {
    type: 'ftpfilenamewitheditor',
    label: 'File key',
    editorTitle: 'Build file key',
    required: true,
    showAllSuggestions: true,
    defaultValue: r => r && r.s3 && r.s3.fileKey,
    refreshOptionsOnChangesTo: ['file.type'],
  },
  's3.backupBucket': {
    type: 'text',
    label: 'Backup bucket name',
    helpKey: 'import.s3.backupBucket',
  },
};

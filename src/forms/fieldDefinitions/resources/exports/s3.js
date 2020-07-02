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
    editorTitle: 'Build bucket name',
    required: true,
  },
  's3.keyStartsWith': {
    type: 'namewitheditor',
    label: 'Key starts with',
    editorTitle: 'Build Key starts with',
  },
  's3.keyEndsWith': {
    type: 'namewitheditor',
    label: 'Key ends with',
    editorTitle: 'Build Key ends with',
  },
  's3.backupBucket': {
    type: 'text',
    label: 'Archived bucket name',
    helpKey: 'export.s3.backupBucket',
    visibleWhen: [
      {
        field: 'file.skipDelete',
        is: [false],
      }
    ]
  },
};

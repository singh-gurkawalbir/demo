import DateTimeDisplay from '../../../../DateTimeDisplay';

export default function getMetadata(revertToRevision = {}) {
  const metadata = {
    fieldMap: {
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        label: 'Description',
        helpKey: 'revert.description',
        required: true,
      },
      revertToRevisionDescription: {
        id: 'revertToRevisionDescription',
        name: 'revertToRevisionDescription',
        type: 'text',
        label: 'Revert to revision description',
        defaultValue: revertToRevision.description,
        disableText: true,
      },
      revertToRevisionCreatedDate: {
        id: 'revertToRevisionCreatedDate',
        name: 'revertToRevisionCreatedDate',
        type: 'text',
        helpKey: 'revert.revision.createdAt',
        label: 'Revert to revision created date',
        defaultValue: DateTimeDisplay({dateTime: revertToRevision.createdAt}),
        disableText: true,
      },
      revertToRevisionID: {
        id: 'revertToRevisionID',
        name: 'revertToRevisionID',
        type: 'text',
        label: 'Revert to revision ID',
        defaultValue: revertToRevision._id,
        helpKey: 'revert.revisionId',
        disableText: true,
      },
    },
  };

  return metadata;
}


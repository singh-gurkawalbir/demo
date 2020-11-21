export default function getEditorsByResource(resource) {
  const { adaptorType } = resource;

  // eslint-disable-next-line no-console
  console.log('getEditorsByResource: ', resource);

  switch (adaptorType) {
    case 'FTPExport':
      return [
        {type: 'csvParser', fieldId: '??'},
        {type: 'transform', fieldId: '??'},
      ];
    default:
      // eslint-disable-next-line no-console
      console.warn(`getEditorsByResource probably needs to be updated to support ${adaptorType} resources`);

      return [];
  }
}

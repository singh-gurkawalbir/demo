export default function commMetadataPathGen({
  applicationType,
  connectionId,
  metadataType,
  mode,
  recordType,
  selectField,
  addInfo,
}) {
  let commMetadataPath;

  if (applicationType === 'netsuite') {
    if (mode === 'webservices' && metadataType !== 'recordTypes') {
      commMetadataPath = `netSuiteWS/${metadataType}`;
    } else {
      commMetadataPath = `${applicationType}/metadata/${mode}/connections/${connectionId}/${metadataType}`;

      if (selectField && recordType) {
        commMetadataPath += `/${recordType}/selectFieldValues/${selectField}`;
      } else if (recordType) {
        commMetadataPath += `/${recordType}`;
      }
    }
  } else if (applicationType === 'salesforce') {
    commMetadataPath = `${applicationType}/metadata/connections/${connectionId}/${metadataType}`;

    if (recordType) {
      commMetadataPath += `/${recordType}`;
    }
  } else {
    throw Error('Invalid application type...cannot support it');
  }

  if (addInfo) {
    if (addInfo.refreshCache === true) {
      commMetadataPath += '?refreshCache=true';
    }

    if (addInfo.recordTypeOnly === true) {
      commMetadataPath += `${
        addInfo.refreshCache === true ? '&' : '?'
      }recordTypeOnly=true`;
    }
  }

  return commMetadataPath;
}

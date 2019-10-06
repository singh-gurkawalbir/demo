import { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import openExternalUrl from '../../utils/window';

function isValidURL(url) {
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}

export default function JobErrorMessage({
  message,
  exportDataURI,
  importDataURI,
}) {
  let exportRecordLink;
  let exportRecordText;
  let importRecordLink;
  let importRecordText;

  if (exportDataURI) {
    if (isValidURL(exportDataURI)) {
      exportRecordLink = exportDataURI;
    } else {
      exportRecordText = `Export Id: ${exportDataURI}`;
    }
  }

  if (importDataURI) {
    if (isValidURL(importDataURI)) {
      importRecordLink = importDataURI;
    } else {
      importRecordText = `Import Id: ${importDataURI}`;
    }
  }

  function handleRecordLinkClick(url) {
    openExternalUrl({ url });
  }

  return (
    <Fragment>
      {message}
      <div>
        {exportRecordLink && (
          <Button
            data-test="viewExportRecord"
            variant="text"
            onClick={() => {
              handleRecordLinkClick(exportRecordLink);
            }}>
            View Export Record
          </Button>
        )}
        {exportRecordText}
        {importRecordLink && (
          <Button
            data-test="viewImportRecord"
            variant="text"
            onClick={() => {
              handleRecordLinkClick(importRecordLink);
            }}>
            View Import Record
          </Button>
        )}
        {importRecordText}
      </div>
    </Fragment>
  );
}

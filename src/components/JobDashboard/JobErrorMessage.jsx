import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import openExternalUrl from '../../utils/window';
import {getParsedMessage} from '../../utils/string';
import RawHtml from '../RawHtml';
import { TextButton } from '../Buttons';

const useStyles = makeStyles({
  jobErrorMessage: {
    wordBreak: 'break-word',
  },
});

function isValidURL(url) {
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}

const options = { allowedTags: ['a'] };
export default function JobErrorMessage({
  message,
  exportDataURI,
  importDataURI,
}) {
  let exportRecordLink;
  let exportRecordText;
  let importRecordLink;
  let importRecordText;
  const classes = useStyles();

  // console.log(message);
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
    <>
      <RawHtml className={classes.jobErrorMessage} html={getParsedMessage(message)} options={options} />
      <div>
        {exportRecordLink && (
          <TextButton
            data-test="viewExportRecord"
            onClick={() => {
              handleRecordLinkClick(exportRecordLink);
            }}>
            View export record
          </TextButton>
        )}
        {exportRecordText}
        {importRecordLink && (
          <TextButton
            data-test="viewImportRecord"
            onClick={() => {
              handleRecordLinkClick(importRecordLink);
            }}>
            View import record
          </TextButton>
        )}
        {importRecordText}
      </div>
    </>
  );
}

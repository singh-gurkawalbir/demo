import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import RawHtml from '../../../RawHtml';
import { selectors } from '../../../../reducers';
import openExternalUrl from '../../../../utils/window';
import {getParsedMessage} from '../../../../utils/string';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    wordBreak: 'break-word',
  },
  message: {
    height: '100%',
    overflow: 'hidden',
    paddingRight: theme.spacing(1),
    lineHeight: '24px',
  },
  htmlMessage: {
    display: 'inline',
    '& > pre': {
      whiteSpace: 'pre-wrap',
    },
  },
  retryTag: {
    marginRight: theme.spacing(1),
    border: '1px solid',
    borderRadius: 3,
    fontSize: 12,
    padding: '1px 5px 1px 5px',
    borderColor: theme.palette.secondary.dark,
  },
}));

function isValidURL(url) {
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
}

const options = {allowedTags: ['a']};
export default function ErrorMessage({errorId, message, flowId, resourceId, exportDataURI, importDataURI }) {
  let exportRecordLink;
  let exportRecordText;
  let importRecordLink;
  let importRecordText;
  const classes = useStyles();

  const isErrorRetryFailed = useSelector(state => {
    const error = selectors.resourceError(state, {
      flowId,
      resourceId,
      errorId,
    });

    return !error?._flowJobId;
  });
  const retryFailedTag = <span className={classes.retryTag}> Retry failed </span>;

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
  const handleRecordLinkClick = url => openExternalUrl({ url });

  return (
    <div className={classes.wrapper}>
      <div className={classes.message} data-private>
        {isErrorRetryFailed && retryFailedTag}
        <RawHtml html={getParsedMessage(message)} options={options} className={classes.htmlMessage} />
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
      </div>
    </div>
  );
}

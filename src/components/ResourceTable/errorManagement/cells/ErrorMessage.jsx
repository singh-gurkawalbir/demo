import React from 'react';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import RawHtml from '../../../RawHtml';
import { selectors } from '../../../../reducers';
import openExternalUrl from '../../../../utils/window';

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 90,
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

export default function ErrorMessage({ message, traceKey, flowId, resourceId, exportDataURI, importDataURI }) {
  let exportRecordLink;
  let exportRecordText;
  let importRecordLink;
  let importRecordText;
  const classes = useStyles();
  const isRetryFailed = useSelector(state => selectors.isTraceKeyRetried(state, {
    flowId,
    resourceId,
    traceKey,
  }));
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
      <div className={classes.message}>
        {isRetryFailed && retryFailedTag}
        <RawHtml html={message} className={classes.htmlMessage} />
        <div>
          {exportRecordLink && (
          <Button
            data-test="viewExportRecord"
            variant="text"
            onClick={() => {
              handleRecordLinkClick(exportRecordLink);
            }}>
            View export record
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
            View import record
          </Button>
          )}
          {importRecordText}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import RawHtml from '../../../RawHtml';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(() => ({
  wrapper: {
    position: 'relative',
    overflowY: 'auto',
    maxHeight: 90,
    wordBreak: 'break-word',
  },
  message: {
    height: '100%',
    overflow: 'hidden',
  },
  htmlMessage: {
    '& > pre': {
      whiteSpace: 'pre-wrap',
    },
  },
  retryTag: {

  },

}));

export default function ErrorMessage({ message, traceKey, flowId, resourceId }) {
  const classes = useStyles();
  const isRetryFailed = useSelector(state => selectors.isTraceKeyRetried(state, {
    flowId,
    resourceId,
    traceKey,
  }));

  return (
    <div className={classes.wrapper}>
      <div className={classes.message}>
        {isRetryFailed === true ? 1 : 0}  <RawHtml html={message} className={classes.htmlMessage} />
      </div>
    </div>
  );
}

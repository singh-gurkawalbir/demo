import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import RawHtml from '../../../RawHtml';
import { selectors } from '../../../../reducers';

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
  },
  htmlMessage: {
    display: 'inline',
    '& > pre': {
      whiteSpace: 'pre-wrap',
    },
  },
  retryTag: {
    background: theme.palette.background.paper2,
    marginRight: theme.spacing(1),
  },
}));

export default function ErrorMessage({ message, traceKey, flowId, resourceId }) {
  const classes = useStyles();
  const isRetryFailed = useSelector(state => selectors.isTraceKeyRetried(state, {
    flowId,
    resourceId,
    traceKey,
  }));
  const retryFailedTag = <span className={classes.retryTag}> Retry failed </span>;

  return (
    <div className={classes.wrapper}>
      <div className={classes.message}>
        {isRetryFailed && retryFailedTag}
        <RawHtml html={message} className={classes.htmlMessage} />
      </div>
    </div>
  );
}

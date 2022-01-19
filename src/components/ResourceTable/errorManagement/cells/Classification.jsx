import React from 'react';
import { Tooltip } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import TimeAgo from 'react-timeago';
import TextOverflowCell from '../../../TextOverflowCell';
import { CLASSIFICATION_LABELS_MAP } from '../../../../utils/errorManagement';
import AutoRetryIcon from '../../../icons/AutoRetryIcon';

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`;

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },
});

export default function Classification({ error }) {
  const classes = useStyles();
  const { classification, retryAt } = error;

  if (classification === CLASSIFICATION_LABELS_MAP.intermittent && !!retryAt) {
    return (
      <span className={classes.wrapper}>
        {classification}
        <Tooltip title={<><span>Next Auto-retry: </span><TimeAgo date={retryAt} formatter={formatter} /></>} >
          <span><AutoRetryIcon /></span>
        </Tooltip>
      </span>
    );
  }

  return <TextOverflowCell message={classification} />;
}

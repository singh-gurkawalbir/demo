import React from 'react';
import { Tooltip } from '@material-ui/core';
import TimeAgo from 'react-timeago';
import TextOverflowCell from '../../../TextOverflowCell';
import { CLASSIFICATION_LABELS_MAP } from '../../../../utils/errorManagement';
import FilterIcon from '../../../icons/FilterIcon';

const formatter = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''}`;

export default function Classification({ error }) {
  const { classification, retryAt } = error;

  if (classification === CLASSIFICATION_LABELS_MAP.intermittent && !!retryAt) {
    return (
      <span>
        {classification}
        <Tooltip data-public title={<><span>Next Auto-retry: </span><TimeAgo date={retryAt} formatter={formatter} /></>} >
          <span><FilterIcon /></span>
        </Tooltip>
      </span>
    );
  }

  return <TextOverflowCell message={classification} />;
}

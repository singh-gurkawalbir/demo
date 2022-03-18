import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import { FB_SOURCE_COLUMN_WIDTH } from '../constants';
import Title from './Title';

const useStyles = makeStyles(theme => ({
  sourceTitle: {
    left: ({xOffset}) => xOffset,
    background: `radial-gradient(circle at center, ${theme.palette.background.paper}, 80%, transparent)`,
  },
}));

export default function DestinationTitle({onClick}) {
  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x,, scale] = useStoreState(s => s.transform);
  const columnWidth = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);
  const xOffset = columnWidth + 20;

  const classes = useStyles({xOffset});

  return (
    <Title onClick={onClick} className={classes.sourceTitle}>
      DESTINATIONS & LOOKUPS
    </Title>
  );
}

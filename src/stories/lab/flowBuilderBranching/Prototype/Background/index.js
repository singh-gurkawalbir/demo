import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import { FB_SOURCE_COLUMN_WIDTH } from '../constants';

const useStyles = makeStyles(theme => ({
  svgBg: {
    width: '100%',
    height: '100%',
  },
  rectangle: {
    fill: theme.palette.background.paper2,
  },
}));

export function Background() {
  const classes = useStyles();
  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x, , scale] = useStoreState(s => s.transform);
  const width = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);
  // console.log({x, scale});

  return (
    <svg className={classes.svgBg}>
      <rect
        className={classes.rectangle}
        x={0}
        y={0}
        // if the user pans the flow, we need to also adjust the width of
        // the source rectangle to accommodate the pan offset.
        // note that the "x" offset is ALREADY scaled. No need to multiply it
        // by the scale.
        width={width}
        height="100%" />
    </svg>
  );
}

export default memo(Background);

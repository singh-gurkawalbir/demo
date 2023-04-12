import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import { useSelector } from 'react-redux';
import { FB_ICON_VIEW_SOURCE_COLUMN_WIDTH, FB_SOURCE_COLUMN_WIDTH } from '../../../../constants';
import { useFlowContext } from '../Context';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  svgBg: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  rectangle: {
    fill: theme.palette.background.default,
  },
}));

export function Background() {
  const classes = useStyles();
  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x, , scale] = useStoreState(s => s.transform);
  const {flowId} = useFlowContext();
  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );

  const sourceColumnWidth = isIconView ? FB_ICON_VIEW_SOURCE_COLUMN_WIDTH : FB_SOURCE_COLUMN_WIDTH;
  const width = Math.max(0, sourceColumnWidth * scale + x);

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

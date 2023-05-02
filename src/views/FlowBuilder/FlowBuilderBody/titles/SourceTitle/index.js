import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useStore } from 'reactflow';
import { useSelector } from 'react-redux';
import Title from '../Title';
import { useFlowContext } from '../../Context';
import { FB_SOURCE_COLUMN_WIDTH, FB_ICON_VIEW_SOURCE_COLUMN_WIDTH } from '../../../../../constants';
import { useHandleAddGenerator } from '../../../hooks';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  sourceTitle: {
    cursor: 'default',
    background: `linear-gradient(${theme.palette.background.default}, 95%, #FFF0)`,
  },
}));

const SourceTitle = () => {
  // we don't care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x, , scale] = useStore(s => s.transform);
  const {flowId} = useFlowContext();
  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );

  const minTitleWidth = isIconView ? 80 : 140;
  const width = isIconView ? FB_ICON_VIEW_SOURCE_COLUMN_WIDTH : FB_SOURCE_COLUMN_WIDTH;
  const columnWidth = Math.max(0, width * scale + x);
  const titleWidth = Math.max(columnWidth, minTitleWidth);
  let xOffset = (columnWidth - titleWidth) / 2; // + menuWidth;

  // by default, the title is centered in the source column. If however
  // the source column is narrower than the title, then we left-shift the
  // title to have it naturally scroll off the screen locked to the right
  // edge of the source column.
  if (xOffset < 0) {
    xOffset = columnWidth - titleWidth;
  }

  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));
  const classes = useStyles({ xOffset, titleWidth });
  const handleAddGenerator = useHandleAddGenerator();

  return (
    <Title
      className={classes.sourceTitle} onClick={handleAddGenerator} type="generator"
      sx={{
        width: titleWidth,
        left: xOffset,
      }}>
      {isDataLoaderFlow ? 'SOURCE' : 'SOURCES'}
    </Title>
  );
};
export default React.memo(SourceTitle);

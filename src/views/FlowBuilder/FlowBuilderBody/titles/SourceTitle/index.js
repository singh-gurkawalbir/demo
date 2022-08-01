import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import Title from '../Title';
import { FB_SOURCE_COLUMN_WIDTH } from '../../../../../constants';
import { useHandleAddGenerator } from '../../../hooks';

const minTitleWidth = 140;

const useStyles = makeStyles(theme => ({
  sourceTitle: {
    width: ({ titleWidth }) => titleWidth,
    left: ({ xOffset }) => xOffset,
    background: `linear-gradient(${theme.palette.background.default}, 95%, #FFF0)`,
  },
}));

const SourceTitle = () => {
  // we don't care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x, , scale] = useStoreState(s => s.transform);
  const columnWidth = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);
  const titleWidth = Math.max(columnWidth, minTitleWidth);
  let xOffset = (columnWidth - titleWidth) / 2; // + menuWidth;

  // by default, the title is centered in the source column. If however
  // the source column is narrower than the title, then we left-shift the
  // title to have it naturally scroll off the screen locked to the right
  // edge of the source column.
  if (xOffset < 0) {
    xOffset = columnWidth - titleWidth;
  }

  const classes = useStyles({ xOffset, titleWidth });
  const handleAddGenerator = useHandleAddGenerator();

  return (
    <Title className={classes.sourceTitle} onClick={handleAddGenerator} type="generator">
      SOURCES
    </Title>
  );
};
export default React.memo(SourceTitle);

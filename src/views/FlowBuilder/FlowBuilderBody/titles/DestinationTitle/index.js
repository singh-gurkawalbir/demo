import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import Title from '../Title';
import AddNodeMenuPopper from './BranchMenuPopper';
import { FB_SOURCE_COLUMN_WIDTH } from '../../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  title: {
    left: ({xOffset}) => xOffset,
    width: ({columnWidth}) => `calc(100% - ${columnWidth}px)`,
    background: `linear-gradient(${theme.palette.background.paper}, 95%, transparent)`,
  },
}));

export default function DestinationTitle() {
  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x,, scale] = useStoreState(s => s.transform);
  const columnWidth = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);

  const xOffset = columnWidth;
  const classes = useStyles({xOffset, columnWidth});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = event => {
    event && setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Title onClick={handleOpenMenu} className={classes.title}>
        DESTINATIONS & LOOKUPS
      </Title>
      <AddNodeMenuPopper
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
      />
    </>
  );
}

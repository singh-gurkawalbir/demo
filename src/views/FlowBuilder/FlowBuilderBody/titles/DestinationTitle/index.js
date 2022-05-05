import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useStoreState } from 'react-flow-renderer';
import { useDispatch } from 'react-redux';
import Title from '../Title';
import AddNodeMenuPopper from './BranchMenuPopper';
import { FB_SOURCE_COLUMN_WIDTH } from '../../../../../constants';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import { useFlowContext } from '../../Context';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  title: {
    left: ({xOffset}) => xOffset,
    width: ({columnWidth}) => `calc(100% - ${columnWidth}px)`,
    background: `linear-gradient(${theme.palette.background.paper}, 95%, transparent)`,
  },
}));

const DestinationTitle = () => {
  const {flow} = useFlowContext();
  const flowOriginal = useSelectorMemo(selectors.makeResourceDataSelector, 'flows', flow?._id)?.merged;

  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const dispatch = useDispatch();
  const [x,, scale] = useStoreState(s => s.transform);
  const columnWidth = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);
  const xOffset = columnWidth;
  const classes = useStyles({xOffset, columnWidth});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = event => {
    if (flowOriginal?.pageProcessors?.length) {
      dispatch(actions.flow.addNewPPStep(flow._id));
    } else {
      event && setAnchorEl(event.currentTarget);
    }
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
};
export default React.memo(DestinationTitle);

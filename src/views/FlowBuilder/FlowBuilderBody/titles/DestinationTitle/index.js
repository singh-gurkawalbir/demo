import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useStore } from 'reactflow';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Title from '../Title';
import BranchMenuPopper from './BranchMenuPopper';
import { FB_SOURCE_COLUMN_WIDTH } from '../../../../../constants';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import { useFlowContext } from '../../Context';
import { getAllFlowBranches } from '../../lib';
import { generateNewId } from '../../../../../utils/resource';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  title: {
    cursor: 'default',
    left: ({ xOffset }) => xOffset,
    width: ({ columnWidth }) => `calc(100% - ${columnWidth}px)`,
    background: `linear-gradient(${theme.palette.background.paper}, 95%, #FFF0)`,
  },
}));

const DestinationTitle = () => {
  const { flowId, flow, elements } = useFlowContext();
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const flowOriginal =
    useSelectorMemo(selectors.makeResourceDataSelector, 'flows', flowId)
      ?.merged || {};
  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));

  // we dont care about the y axis since we always want 100% y axis coverage,
  // regardless of pan or zoom settings.
  const [x, , scale] = useStore(s => s.transform);
  const columnWidth = Math.max(0, FB_SOURCE_COLUMN_WIDTH * scale + x);
  const xOffset = columnWidth;
  const classes = useStyles({ xOffset, columnWidth });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const branches = getAllFlowBranches(flow, elements);
  const isLinearFlow = !flowOriginal.routers?.length;
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = event => {
    if (isLinearFlow || branches.length === 1) {
      if (!isLinearFlow) {
        dispatch(
          actions.flow.addNewPPStepInfo(flowId, {
            branchPath: branches[0].path,
          })
        );
      }
      const newTempProcessorId = generateNewId();
      const addPPUrl = buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: match.url,
        params: { resourceType: 'pageProcessor', id: newTempProcessorId },
      });

      history.push(addPPUrl);
    } else {
      event && setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
      <Title onClick={handleOpenMenu} className={classes.title}>
        {isDataLoaderFlow ? 'DESTINATION APPLICATION' : 'DESTINATIONS & LOOKUPS'}
      </Title>

      <BranchMenuPopper anchorEl={anchorEl} handleClose={handleCloseMenu} />
    </>
  );
};

export default React.memo(DestinationTitle);

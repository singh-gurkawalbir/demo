import clsx from 'clsx';
import React, {useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';
import actions from '../../../../actions';
import PageProcessor from '../../PageProcessor';

const useStyles = makeStyles(theme => ({
  root: {
    width: 250,
    cursor: 'default',
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  branchContainer: {
    padding: theme.spacing(4, 2),
    height: 150,
    marginBottom: -90,
    borderRadius: theme.spacing(2.5, 2.5, 0, 0),
    overflow: 'hidden',
    '&:hover': {
      // backgroundColor: theme.palette.background.paper2,
      backgroundColor: theme.palette.background.default,
      '& > span': {
        display: 'block !important',
      },
    },
  },
  firstBranchStep: {
    '& > span': {
      display: 'block !important',
    },
  },
  branchName: {
    display: 'none',
    textTransform: 'none',
  },
}));

export default function PageProcessorNode({ data = {} }) {
  const { branch = {}, isFirst, isLast, hideDelete, isVirtual } = data;
  const dispatch = useDispatch();
  const classes = useStyles();

  const { flow, flowId } = useFlowContext();
  const integrationId = flow?._integrationId;
  const flowErrorsMap = useSelector(state => selectors.openErrorsMap(state, flowId));
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));

  const handleDelete = useCallback(id => {
    dispatch(actions.flow.deleteStep(flowId, id));
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <DefaultHandle type="target" position={Position.Left} />

      <div className={classes.contentContainer} >
        <div>
          <div className={clsx(classes.branchContainer, {[classes.firstBranchStep]: isFirst})}>
            {!isVirtual && (
              <Typography variant="overline" className={classes.branchName}>
                {branch.name}
              </Typography>
            )}
          </div>

          <PageProcessor
            {...data.resource}
            onDelete={!hideDelete && handleDelete}
            flowId={flowId}
            integrationId={integrationId}
            openErrorCount={(flowErrorsMap && flowErrorsMap[data.resource?._importId || data.resource?._exportId]) || 0}
            isViewMode={isViewMode || isFreeFlow}
            isMonitorLevelAccess={isMonitorLevelAccess}
            isLast={isLast}
          />
        </div>
      </div>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}

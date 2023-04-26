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
import { PageProcessorPathRegex } from '../../../../constants';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import { useHandleMovePP } from '../../hooks';
import messageStore from '../../../../utils/messageStore';
import CeligoTruncate from '../../../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  root: {
    width: 250,
    cursor: 'default',
  },
  newroot: {
    cursor: 'default',
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  newcontentContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(2),
    height: 95,
    transition: 'ease all 0.3s',
    // boxShadow: '0 0 0 rgba(0,0,0,0)',
    borderRadius: 6,
    '&:hover': {
      // boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
    },
  },
  branchContainer: {
    padding: theme.spacing(4, 2),
    height: 150,
    marginBottom: -90,
    borderRadius: theme.spacing(2.5, 2.5, 0, 0),
    overflow: 'hidden',
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.background.default,
      '& > $branchName': {
        display: 'flex',
      },
    },
  },
  newbranchContainer: {
    marginTop: theme.spacing(0.5),
    '&:hover': {
      // backgroundColor: theme.palette.background.paper2,
      backgroundColor: theme.palette.background.default,
    },
  },
  firstBranchStep: {
    '& > $branchName': {
      display: 'flex',
    },
  },
  branchName: {
    display: 'none',
    textTransform: 'none',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    width: theme.spacing(29),
  },
  newbranchName: {
    textTransform: 'none',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
}));

export default function PageProcessorNode({ data = {}}) {
  const { branch = {}, isFirst, isLast, hideDelete, isVirtual, path, resource = {}, showLeft = false, showRight = false, isSubFlow } = data;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [, routerIndex, branchIndex, pageProcessorIndex] = PageProcessorPathRegex.exec(path);

  const { flow, flowId } = useFlowContext();
  const integrationId = flow?._integrationId;
  const flowErrorsMap = useSelector(state => selectors.openErrorsMap(state, flowId));
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const isIconView = useSelector(state =>
    selectors.fbIconview(state, flowId) === 'icon'
  );

  const {confirmDialog} = useConfirmDialog();
  const handlePPMove = useHandleMovePP();
  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));
  const isFlowSaveInProgress = useSelector(state => selectors.isFlowSaveInProgress(state, flowId));
  const showDelete = !hideDelete && !isFlowSaveInProgress;
  const handleDelete = useCallback(id => {
    if (resource.setupInProgress) {
      dispatch(actions.flow.deleteStep(flowId, id));
    } else {
      confirmDialog({
        title: 'Confirm remove',
        message: messageStore('CONFIRM_REMOVE'),
        buttons: [
          {
            label: 'Remove',
            onClick: () => {
              dispatch(actions.flow.deleteStep(flowId, id));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, flowId]);

  return (
    <div className={clsx({[classes.newroot]: isIconView}, {[classes.root]: !isIconView})}>
      <DefaultHandle type="target" position={Position.Left} />

      <div className={clsx({[classes.newcontentContainer]: isIconView}, {[classes.contentContainer]: !isIconView})} >
        <div>
          {!isIconView && (
          <div className={clsx(classes.branchContainer, {[classes.firstBranchStep]: isFirst})}>
            {!isVirtual && (
              <Typography variant="overline" className={classes.branchName}>
                <CeligoTruncate lines={1}>
                  {branch.name}
                </CeligoTruncate>
              </Typography>
            )}
          </div>
          )}
          <PageProcessor
            {...data.resource}
            onDelete={showDelete && handleDelete}
            flowId={flowId}
            integrationId={integrationId}
            openErrorCount={(flowErrorsMap && flowErrorsMap[data.resource?._importId || data.resource?._exportId]) || 0}
            isViewMode={isViewMode || isFreeFlow}
            isMonitorLevelAccess={isMonitorLevelAccess}
            isLast={isLast}
            showLeft={!!showLeft}
            showRight={!!showRight}
            path={path}
            isSubFlow={isSubFlow}
            onMove={handlePPMove}
            routerIndex={routerIndex}
            branchIndex={branchIndex}
            isIconView={isIconView}
            pageProcessorIndex={pageProcessorIndex}
          />
        </div>
      </div>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}

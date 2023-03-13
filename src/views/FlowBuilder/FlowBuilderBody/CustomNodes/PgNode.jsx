import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import PageGenerator from '../../PageGenerator';
import { PageGeneratorRegex } from '../../../../constants';
import { useHandleMovePG } from '../../hooks';

const useStyles = makeStyles(theme => ({
  pgContainer: {
    paddingTop: 60,
  },
  newpgContainer: {
    paddingTop: 0,
  },
  root: {
    width: 250,
    margin: theme.spacing(0, -0.5),
    cursor: 'default',
  },
  newroot: {
    margin: theme.spacing(0, -0.5),
    cursor: 'default',
  },
}));

export default function PageGeneratorNode(props) {
  const { data = {}} = props;
  const { isSubFlow} = data;
  const classes = useStyles();
  const { flow, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const flowErrorsMap = useSelector(state => selectors.openErrorsMap(state, flowId));
  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow?._integrationId, flowId));
  const isFlowSaveInProgress = useSelector(state => selectors.isFlowSaveInProgress(state, flowId));
  const showDelete = !data.hideDelete && !isFlowSaveInProgress;
  const [, pgIndex = ''] = PageGeneratorRegex.exec(data.path) || [];

  const handleDelete = useCallback(id => {
    dispatch(actions.flow.deleteStep(flowId, id));
  }, [dispatch, flowId]);
  const handleMove = useHandleMovePG(flowId);

  // alert(isSubFlow);
  const iconView = useSelector(state =>
    selectors.fbIconview(state, flowId)
  );

  // const isSubFlow = false;

  return (
    <div className={iconView === 'icon' ? classes.newroot : classes.root}>
      <div className={iconView === 'icon' ? classes.newpgContainer : classes.pgContainer}>
        <PageGenerator
          className={classes.pageGenerator}
          {...data}
          index={+pgIndex}
          isSubFlow={isSubFlow}
          onDelete={showDelete && handleDelete}
          flowId={flowId}
          onMove={handleMove}
          integrationId={flow?._integrationId}
          openErrorCount={(flowErrorsMap && flowErrorsMap[data._exportId]) || 0}
          isViewMode={isViewMode || isFreeFlow}
          iconView={iconView}
        />
      </div>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}

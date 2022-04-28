import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import PageGenerator from '../../PageGenerator';

const useStyles = makeStyles(theme => ({
  pgContainer: {
    paddingTop: 60,
  },
  root: {
    width: 250,
    margin: theme.spacing(0, -0.5),
  },
}));

export default function PageGeneratorNode(props) {
  const { data = {}, id } = props;
  const classes = useStyles();
  const { flow } = useFlowContext();
  const flowId = flow?._id;
  const dispatch = useDispatch();
  const flowErrorsMap = useSelector(state => selectors.openErrorsMap(state, flowId));
  const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow._integrationId, flowId));

  const handleDelete = useCallback(() => {
    dispatch(actions.flow.deleteStep(flowId, id));
  }, [dispatch, flowId, id]);

  return (
    <div className={classes.root}>
      <div className={classes.pgContainer}>
        <PageGenerator
          className={classes.pageGenerator}
          {...data}
          onDelete={handleDelete}
          flowId={flowId}
          integrationId={flow._integrationId}
          openErrorCount={(flowErrorsMap && flowErrorsMap[data._exportId]) || 0}
          isViewMode={isViewMode || isFreeFlow}
        />
      </div>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}

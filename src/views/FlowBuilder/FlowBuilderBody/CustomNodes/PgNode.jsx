import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { useDispatch } from 'react-redux';
import AppBlock from '../../AppBlock';
import exportHooksAction from '../../PageGenerator/actions/exportHooks';
import transformationAction from '../../PageGenerator/actions/transformation_afe';
import exportFilterAction from '../../PageGenerator/actions/exportFilter_afe';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';
import actions from '../../../../actions';

const generatorActions = [
  {
    ...transformationAction,
    isUsed: true,
  },
  {
    ...exportFilterAction,
  },
  { ...exportHooksAction, isUsed: true },
];

const useStyles = makeStyles(theme => ({
  pgContainer: {
    paddingTop: 60,
  },
  root: {
    width: 250,
    margin: theme.spacing(0, -0.5),
  },
}));

export default function PageGenerator(props) {
  const { data, id } = props;
  const { name: label, connectorType } = data;
  const classes = useStyles();
  const { flow } = useFlowContext();
  const flowId = flow?._id;
  const dispatch = useDispatch();

  const handleDelete = useCallback(() => {
    dispatch(actions.flow.deleteStep(flowId, id));
  }, [dispatch, flowId, id]);

  return (
    <div className={classes.root}>
      <div className={classes.pgContainer}>
        <AppBlock
          name={label}
          connectorType={connectorType}
          blockType="export"
          onDelete={handleDelete}
          actions={generatorActions}
          resource={{}}
          resourceId={id}
          resourceType="exports"
          index="0"
          isPageGenerator
      />
      </div>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}

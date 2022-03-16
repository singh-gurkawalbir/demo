import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import AppBlock from '../../../../../views/FlowBuilder/AppBlock';
import exportHooksAction from '../../../../../views/FlowBuilder/PageGenerator/actions/exportHooks';
import transformationAction from '../../../../../views/FlowBuilder/PageGenerator/actions/transformation_afe';
import exportFilterAction from '../../../../../views/FlowBuilder/PageGenerator/actions/exportFilter_afe';
import AppBlockHandle from './Handles/AppBlockHandle';
import { useHandleDeleteNode } from '../hooks';

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

  const handleDelete = useHandleDeleteNode(id);

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

      <AppBlockHandle type="source" position={Position.Right} />
    </div>
  );
}

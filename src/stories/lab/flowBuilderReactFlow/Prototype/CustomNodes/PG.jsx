import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Handle, Position } from 'react-flow-renderer';
import AppBlock from '../../../../../views/FlowBuilder/AppBlock';
import exportHooksAction from '../../../../../views/FlowBuilder/PageGenerator/actions/exportHooks';
import transformationAction from '../../../../../views/FlowBuilder/PageGenerator/actions/transformation_afe';
import exportFilterAction from '../../../../../views/FlowBuilder/PageGenerator/actions/exportFilter_afe';

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
    display: 'flex',
    alignItems: 'flex-start',
  },
  root: {
    width: 250,
    margin: theme.spacing(0, -0.5),
  },
}));

export default function PageGenerator(props) {
  const { data, id } = props;
  const { label, connectorType } = data;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.pgContainer}>
        <AppBlock
          name={label}
          connectorType={connectorType}
          blockType="export"
          actions={generatorActions}
          resource={{}}
          resourceId={id}
          resourceType="exports"
          index="0"
          isPageGenerator
      />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

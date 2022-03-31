import clsx from 'clsx';
import React, {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Typography } from '@material-ui/core';
import AppBlock from '../../../../../views/FlowBuilder/AppBlock';
import importMappingAction from '../../../../../views/FlowBuilder/PageProcessor/actions/importMapping';
import inputFilterAction from '../../../../../views/FlowBuilder/PageProcessor/actions/inputFilter_afe';
import pageProcessorHooksAction from '../../../../../views/FlowBuilder/PageProcessor/actions/pageProcessorHooks';
import outputFilterAction from '../../../../../views/FlowBuilder/PageProcessor/actions/outputFilter_afe';
import lookupTransformationAction from '../../../../../views/FlowBuilder/PageProcessor/actions/lookupTransformation_afe';
import responseTransformationAction from '../../../../../views/FlowBuilder/PageProcessor/actions/responseTransformation_afe';
// import responseMapping from '../../../../../views/FlowBuilder/PageProcessor/actions/responseMapping_afe';
import DefaultHandle from './Handles/DefaultHandle';
import { useHandleDeleteNode } from '../hooks';

const useStyles = makeStyles(theme => ({
  root: {
    width: 250,
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
  },
}));

export default function PageProcessor({ data = {}, id }) {
  const { branch, isFirst } = data;
  const { name: label, isLookup, connectorType } = data.resource || {};
  const classes = useStyles();

  const processorActions = useMemo(() => {
    const processorActions = [
      {
        ...inputFilterAction,
        isUsed: true,
        helpKey: 'fb.pp.inputFilter',
      },
    ];

    if (isLookup) {
      processorActions.push(
        {
          ...lookupTransformationAction,
          isUsed: true,
        },
        {
          ...outputFilterAction,
        },
        {
          ...pageProcessorHooksAction,
          isUsed: true,
          helpKey: 'fb.pp.exports.hooks',
        }
      );
    } else {
      processorActions.push(
        {
          ...importMappingAction,
          isUsed: true,
        },
        {
          ...responseTransformationAction,
        },
      );
    }
    // processorActions.push({
    //   ...responseMapping,
    //   isUsed: true,
    // });

    return processorActions;
  }, [isLookup]);

  const handleDelete = useHandleDeleteNode(id);

  return (
    <div className={classes.root}>
      <DefaultHandle type="target" position={Position.Left} />

      <div className={classes.contentContainer} >
        <div>
          <div className={clsx(classes.branchContainer, {[classes.firstBranchStep]: isFirst})}>
            <Typography variant="caption" className={classes.branchName}>
              {branch.name}
            </Typography>
          </div>

          <AppBlock
            name={label}
            onDelete={handleDelete}
            connectorType={connectorType}
            blockType={isLookup ? 'export' : 'import'}
            index={id}
            resource={{}}
            resourceId={id}
            resourceIndex={4}
            resourceType={isLookup ? 'exports' : 'imports'}
            actions={processorActions}
        />
        </div>
      </div>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}

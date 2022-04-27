import clsx from 'clsx';
import React, {useCallback, useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import AppBlock from '../../AppBlock';
import importMappingAction from '../../PageProcessor/actions/importMapping';
import inputFilterAction from '../../PageProcessor/actions/inputFilter_afe';
import pageProcessorHooksAction from '../../PageProcessor/actions/pageProcessorHooks';
import outputFilterAction from '../../PageProcessor/actions/outputFilter_afe';
import lookupTransformationAction from '../../PageProcessor/actions/lookupTransformation_afe';
import responseTransformationAction from '../../PageProcessor/actions/responseTransformation_afe';
import responseMapping from '../../PageProcessor/actions/responseMapping_afe';
import DefaultHandle from './Handles/DefaultHandle';
import { useFlowContext } from '../Context';
import actions from '../../../../actions';

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
    textTransform: 'none',
  },
}));

export default function PageProcessor({ data = {}, id }) {
  const { branch = {}, isFirst } = data;
  const dispatch = useDispatch();
  const { name: label = 'test', isLookup, connectorType } = data.resource || {};
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
    processorActions.push({
      ...responseMapping,
      isUsed: true,
    });

    return processorActions;
  }, [isLookup]);

  const { flow } = useFlowContext();

  const handleDelete = useCallback(() => {
    dispatch(actions.flow.deleteStep(flow._id, id));
  }, []);

  return (
    <div className={classes.root}>
      <DefaultHandle type="target" position={Position.Left} />

      <div className={classes.contentContainer} >
        <div>
          <div className={clsx(classes.branchContainer, {[classes.firstBranchStep]: isFirst})}>
            <Typography variant="overline" className={classes.branchName}>
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

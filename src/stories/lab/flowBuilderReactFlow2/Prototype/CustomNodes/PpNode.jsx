import React, {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import AppBlock from '../../../../../views/FlowBuilder/AppBlock';
import importMappingAction from '../../../../../views/FlowBuilder/PageProcessor/actions/importMapping';
import inputFilterAction from '../../../../../views/FlowBuilder/PageProcessor/actions/inputFilter_afe';
import pageProcessorHooksAction from '../../../../../views/FlowBuilder/PageProcessor/actions/pageProcessorHooks';
import outputFilterAction from '../../../../../views/FlowBuilder/PageProcessor/actions/outputFilter_afe';
import lookupTransformationAction from '../../../../../views/FlowBuilder/PageProcessor/actions/lookupTransformation_afe';
import responseTransformationAction from '../../../../../views/FlowBuilder/PageProcessor/actions/responseTransformation_afe';
// import responseMapping from '../../../../../views/FlowBuilder/PageProcessor/actions/responseMapping_afe';
import AppBlockHandle from './Handles/AppBlockHandle';

const useStyles = makeStyles(() => ({
  ppContainer: {
    paddingTop: 60,
  },
  root: {
    width: 250,
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function PageProcessor(props) {
  const { data, id } = props;
  const { label, isLookup, connectorType } = data;
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

  const handleDelete = index => {
    // eslint-disable-next-line no-console
    console.log(index);
  };

  return (
    <div className={classes.root}>
      <AppBlockHandle type="target" position={Position.Left} />

      <div className={classes.contentContainer} >
        <div className={classes.ppContainer}>
          <AppBlock
            name={label}
            onDelete={handleDelete}
            connectorType={connectorType}
            blockType={isLookup ? 'export' : 'import'}
            index={33}
            resource={{}}
            resourceId={id}
            resourceIndex={4}
            resourceType={isLookup ? 'exports' : 'imports'}
            actions={processorActions}
        />
        </div>
      </div>

      <AppBlockHandle type="source" position={Position.Right} />
    </div>
  );
}

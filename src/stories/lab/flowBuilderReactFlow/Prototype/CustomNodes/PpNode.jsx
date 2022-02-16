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
    display: 'flex',
    alignItems: 'flex-start',
  },
  root: {
    // padding: 10,
    // textAlign: 'center',
    width: 250,
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function PageGenerator(props) {
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

  const handleDelete = index => console.log(index);

  return (
    <div className={classes.root}>
      <AppBlockHandle type="target" position={Position.Left} />

      <div className={classes.contentContainer} onMouseEnter={() => console.log('enter')}>
        <div className={classes.ppContainer}>
          <AppBlock
            name={label}
            onDelete={handleDelete}
            connectorType={connectorType}
            blockType={isLookup ? 'export' : 'import'}
            index={33}
            resource={{}}
            resourceId={id}
         // resourceIndex={index}
            resourceType={isLookup ? 'exports' : 'imports'}
            actions={processorActions}
        />
        </div>
      </div>

      <AppBlockHandle type="source" position={Position.Right} />
    </div>
  );
}

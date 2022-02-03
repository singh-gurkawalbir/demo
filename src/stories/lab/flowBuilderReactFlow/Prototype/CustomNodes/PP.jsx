import React, {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Handle, Position } from 'react-flow-renderer';
import AppBlock from '../../../../../views/FlowBuilder/AppBlock';
import importMappingAction from '../../../../../views/FlowBuilder/PageProcessor/actions/importMapping';
import inputFilterAction from '../../../../../views/FlowBuilder/PageProcessor/actions/inputFilter_afe';
import pageProcessorHooksAction from '../../../../../views/FlowBuilder/PageProcessor/actions/pageProcessorHooks';
import outputFilterAction from '../../../../../views/FlowBuilder/PageProcessor/actions/outputFilter_afe';
import lookupTransformationAction from '../../../../../views/FlowBuilder/PageProcessor/actions/lookupTransformation_afe';
import responseTransformationAction from '../../../../../views/FlowBuilder/PageProcessor/actions/responseTransformation_afe';
import responseMapping from '../../../../../views/FlowBuilder/PageProcessor/actions/responseMapping_afe';
import AddNodeButton from './AddNodeButton';

const useStyles = makeStyles(theme => ({
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
  handle: {
    border: 0,
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
    margin: theme.spacing(-0, 2),
    // backgroundPosition: 'right top',
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
    processorActions.push({
      ...responseMapping,
      isUsed: true,
    });

    return processorActions;
  }, [isLookup]);

  return (
    <div className={classes.root}>
      <Handle className={classes.handle} type="target" position={Position.Left} style={{marginTop: -56}} />
      <div className={classes.contentContainer} >
        <AddNodeButton id={id} direction="left" />
        <div className={classes.ppContainer}>
          <AppBlock
            name={label}
            // onDelete={onDelete(name)}
            connectorType={connectorType}
            blockType={isLookup ? 'export' : 'import'}
          // index={index}
            resource={{}}
            resourceId={id}
         // resourceIndex={index}
            resourceType={isLookup ? 'exports' : 'imports'}
            actions={processorActions}
        />
        </div>
        <AddNodeButton id={id} direction="right" />
      </div>
      <Handle className={classes.handle} type="source" position={Position.Right} style={{marginTop: -56}} />
    </div>
  );
}

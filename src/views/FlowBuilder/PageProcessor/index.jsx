import { useRef, Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd-cjs';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import itemTypes from '../itemTypes';
import AppBlock from '../AppBlock';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { getResourceSubType, generateNewId } from '../../../utils/resource';
import importMappingAction from './actions/importMapping';
import inputFilterAction from './actions/inputFilter';
import pageProcessorHooksAction from './actions/pageProcessorHooks';
import outputFilterAction from './actions/outputFilter';
import transformationAction from './actions/transformation';
import responseMapping from './actions/responseMapping';
import responseTransformationAction from './actions/responseTransformation';
import proceedOnFailureAction from './actions/proceedOnFailure';
import { actionsMap, isImportMappingAvailable } from '../../../utils/flows';
import helpTextMap from '../../../components/Help/helpTextMap';

const useStyles = makeStyles(theme => ({
  ppContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  lineRight: {
    minWidth: 130,
  },
  lineLeft: {
    minWidth: 50,
  },
  dottedLine: {
    alignSelf: 'start',
    marginTop: 150,
    borderBottom: `3px dotted ${theme.palette.divider}`,
  },
  pending: {
    minWidth: 50,
  },
}));
const PageProcessor = ({
  match,
  location,
  history,
  flowId,
  index,
  onMove,
  isLast,
  integrationId,
  isViewMode,
  isMonitorLevelAccess,
  onDelete,
  ...pp
}) => {
  const pending = !!pp._connectionId;
  const resourceId = pp._connectionId || pp._exportId || pp._importId;
  const resourceType = pp.type === 'export' ? 'exports' : 'imports';
  const ref = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newProcessorId, setNewProcessorId] = useState(null);
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(
      state,
      pending ? 'connections' : resourceType,
      resourceId
    )
  );
  // Returns map of all possible actions with true/false whether actions performed on the resource
  const usedActions = useSelector(state =>
    selectors.getUsedActionsForResource(state, resourceId, resourceType, pp)
  );
  const createdProcessorId = useSelector(state =>
    selectors.createdResourceId(state, newProcessorId)
  );

  // #region Add Processor on creation effect
  useEffect(() => {
    if (createdProcessorId) {
      const patchSet = [
        {
          op: 'replace',
          path: `/pageProcessors/${index}`,
          value: {
            type: pp.type,
            [pp.type === 'export'
              ? '_exportId'
              : '_importId']: createdProcessorId,
          },
        },
      ];

      // console.log(pp, patchSet);
      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdProcessorId, dispatch]);
  // #endregion

  // #region Drag and Drop handlers
  const [, drop] = useDrop({
    accept: itemTypes.PAGE_PROCESSOR,

    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the right
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width
      // When dragging right, only move when the cursor is below 50%
      // When dragging left, only move when the cursor is above 50%
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_PROCESSOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isViewMode,
  });
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));
  // #endregion

  function handleBlockClick() {
    const newId = generateNewId();

    if (pending) {
      // generate newId
      setNewProcessorId(newId);
      const { type, assistant } = getResourceSubType(resource);
      const application = assistant || type;
      const patchSet = [
        {
          op: 'add',
          path: '/application',
          value: application,
        },
        {
          op: 'add',
          path: '/resourceType',
          value: resourceType,
        },
        {
          op: 'add',
          path: '/_connectionId',
          value: pp._connectionId,
        },
      ];

      // console.log('patchSet: ', patchSet);

      dispatch(actions.resource.patchStaged(newId, patchSet, 'value'));
    }

    const to = pending
      ? `${match.url}/add/pageProcessor/${newId}`
      : `${match.url}/edit/${resourceType}/${resourceId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  // #region Configure available processor actions
  // Add Help texts for actions common to lookups and imports manually

  const processorActions = [
    {
      ...inputFilterAction,
      isUsed: usedActions[actionsMap.inputFilter],
      helpText: helpTextMap[`fb.pp.${resourceType}.inputFilter`],
    },
  ];

  if (!pending) {
    if (pp.type === 'export') {
      processorActions.push(
        {
          ...outputFilterAction,
          isUsed: usedActions[actionsMap.outputFilter],
        },
        {
          ...transformationAction,
          isUsed: usedActions[actionsMap.transformation],
        },
        {
          ...pageProcessorHooksAction,
          isUsed: usedActions[actionsMap.hooks],
          helpText: helpTextMap[`fb.pp.exports.hooks`],
        }
      );
    } else {
      processorActions.push(
        ...(isImportMappingAvailable(resource)
          ? [
              {
                ...importMappingAction,
                isUsed: usedActions[actionsMap.importMapping],
              },
            ]
          : []),
        {
          ...responseTransformationAction,
          isUsed: usedActions[actionsMap.responseTransformation],
        },
        {
          ...pageProcessorHooksAction,
          isUsed: usedActions[actionsMap.hooks],
          helpText: helpTextMap[`fb.pp.imports.hooks`],
        }
      );
    }

    if (!isLast) {
      processorActions.push(
        {
          ...responseMapping,
          isUsed: usedActions[actionsMap.responseMapping],
          helpText: helpTextMap[`fb.pp.${resourceType}.responseMapping`],
        },
        {
          ...proceedOnFailureAction,
          isUsed: usedActions[actionsMap.proceedOnFailure],
          helpText: helpTextMap[`fb.pp.${resourceType}.proceedOnFailure`],
        }
      );
    }
  }

  // #endregion

  return (
    <Fragment>
      <div className={classes.ppContainer}>
        {index === 0 && (
          /* Initial left line connecting Source Apps */
          <div className={clsx(classes.dottedLine, classes.lineLeft)} />
        )}
        <AppBlock
          integrationId={integrationId}
          name={
            pending ? 'Pending configuration' : resource.name || resource.id
          }
          onDelete={onDelete}
          isViewMode={isViewMode}
          isMonitorLevelAccess={isMonitorLevelAccess}
          onBlockClick={handleBlockClick}
          connectorType={resource.adaptorType || resource.type}
          assistant={resource.assistant}
          ref={ref}
          opacity={opacity} /* used for drag n drop */
          blockType={pp.type === 'export' ? 'lookup' : 'import'}
          flowId={flowId}
          index={index}
          resource={resource}
          resourceIndex={index}
          resourceType={resourceType}
          actions={processorActions}
        />
        {!isLast && (
          /* Right connecting line between Page Processors is not needed
             for the last App (nothing to connect) */
          <div
            className={clsx({
              [classes.dottedLine]: !pending,
              [classes.lineRight]: !pending,
              [classes.pending]: pending,
            })}
          />
        )}
      </div>
    </Fragment>
  );
};

export default withRouter(PageProcessor);

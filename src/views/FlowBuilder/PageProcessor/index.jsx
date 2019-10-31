import { useRef, Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd-cjs';
import shortid from 'shortid';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import itemTypes from '../itemTypes';
import AppBlock from '../AppBlock';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import { getResourceSubType, adaptorTypeMap } from '../../../utils/resource';
import importMappingAction from './actions/importMapping';
import templateMappingAction from './actions/templateMapping';
import inputFilterAction from './actions/inputFilter';
import pageProcessorHooksAction from './actions/pageProcessorHooks';
import outputFilterAction from './actions/outputFilter';
import transformationAction from './actions/transformation';
import responseMapping from './actions/responseMapping';
import responseTransformationAction from './actions/responseTransformation';
import proceedOnFailureAction from './actions/proceedOnFailure';
import { actionsMap, getUsedActionsMapForResource } from '../../../utils/flows';

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
  ...pp
}) => {
  const pending = !!pp._connectionId;
  const resourceId = pp._connectionId || pp._exportId || pp._importId;
  const resourceType = pp.type === 'export' ? 'exports' : 'imports';
  const ref = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newProcessorId, setNewProcessorId] = useState(null);
  const [usedActions, setUsedActions] = useState({});
  const { merged: resource = {} } = useSelector(state =>
    selectors.resourceData(
      state,
      pending ? 'connections' : resourceType,
      resourceId
    )
  );

  useEffect(() => {
    if (resource) {
      setUsedActions(getUsedActionsMapForResource(resource, resourceType, pp));
    }
  }, [pp, resource, resourceType]);

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
  });
  const opacity = isDragging ? 0.2 : 1;

  drag(drop(ref));
  // #endregion

  function handleBlockClick() {
    const newId = `new-${shortid.generate()}`;

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
  const processorActions = [
    { ...inputFilterAction, isUsed: usedActions[actionsMap.inputFilter] },
  ];
  // Template mapping action is shown only for http import resource
  const isHTTPImport =
    resource.adaptorType && adaptorTypeMap[resource.adaptorType] === 'http';

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
        }
      );
    } else {
      processorActions.push(
        {
          ...importMappingAction,
          isUsed: usedActions[actionsMap.importMapping],
        },
        ...(isHTTPImport
          ? [
              {
                ...templateMappingAction,
                isUsed: usedActions[actionsMap.templateMapping],
              },
            ]
          : []),
        {
          ...responseTransformationAction,
          isUsed: usedActions[actionsMap.responseTransformation],
        }
      );
    }

    if (!isLast) {
      processorActions.push(
        { ...pageProcessorHooksAction, isUsed: usedActions[actionsMap.hooks] },
        { ...responseMapping, isUsed: usedActions[actionsMap.responseMapping] },
        {
          ...proceedOnFailureAction,
          isUsed: usedActions[actionsMap.proceedOnFailure],
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
          name={
            pending ? 'Pending configuration' : resource.name || resource.id
          }
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

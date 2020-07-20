import React, { useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd-cjs';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import itemTypes from '../itemTypes';
import AppBlock from '../AppBlock';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import {applicationsList} from '../../../constants/applications';
import {
  getResourceSubType,
  generateNewId,
  isRealTimeOrDistributedResource,
} from '../../../utils/resource';
import exportHooksAction from './actions/exportHooks';
import as2RoutingAction from './actions/as2Routing';
import transformationAction from './actions/transformation';
import scheduleAction from './actions/schedule';
import exportFilterAction from './actions/exportFilter';
import { actionsMap } from '../../../utils/flows';

/* TODO: the 'block' const in this file and <AppBlock> should eventually go in the theme.
   We use the block const across several components and thus is a maintenance issue to
   manage as we enhance the FB layout. */
const blockHeight = 200;
const lineHeightOffset = 85;
const lineWidth = 160;
const emptyObj = {};
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: lineWidth,
    marginTop: 85,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    marginTop: -blockHeight,
    height: blockHeight + lineHeightOffset,
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
}));
const PageGenerator = ({
  history,
  match,
  index,
  isLast,
  flowId,
  integrationId,
  isViewMode,
  onDelete,
  onMove,
  onErrors,
  openErrorCount,
  ...pg
}) => {
  const pending = !pg._exportId;
  const resourceId = pg._connectionId || pg._exportId;
  const resourceType = pg._connectionId ? 'connections' : 'exports';
  const { schedule } = pg;
  const classes = useStyles();
  const dispatch = useDispatch();
  const resource = useSelector(state =>
    !resourceId
      ? emptyObj
      : selectors.resource(state, resourceType, resourceId) || emptyObj
  );
  const rdbmsAppType = useSelector(
    state => pending && selectors.rdbmsConnectionType(state, pg._connectionId)
  );
  const isDataLoader =
    pg.application === 'dataLoader' || resource.type === 'simple';
  const exportNeedsRouting = useSelector(state =>
    selectors.exportNeedsRouting(state, resourceId)
  );
  const multipleAs2ExportsOfSameConnectionId = useSelector(state => {
    if (pending) {
      return false;
    }
    const allAS2ExportsMatchingConnId = selectors.resourceList(state, {
      type: 'exports',
      filter: {
        adaptorType: 'AS2Export',
        _connectionId: resource?._connectionId
      },
    });
    return allAS2ExportsMatchingConnId.filtered > 1;
  });
  const connectionHasAs2Routing = useSelector(state => {
    if (!resource || resourceType !== 'exports') return false;

    return selectors.connectionHasAs2Routing(state, resource._connectionId);
  });
  // Returns map of all possible actions with true/false whether actions performed on the resource
  const usedActions =
    useSelector(
      state =>
        selectors.getUsedActionsForResource(
          state,
          resourceId,
          resourceType,
          pg
        ),
      shallowEqual
    ) || {};
  // console.log(pg, usedActions, createdGeneratorId);
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_GENERATOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isViewMode,
  });
  const opacity = isDragging ? 0.2 : 1;
  // #region Drag and Drop handlers
  const [, drop] = useDrop({
    accept: itemTypes.PAGE_GENERATOR,

    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      onMove(dragIndex, hoverIndex);
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));
  // #endregion
  const handleBlockClick = useCallback(() => {
    let newId = generateNewId();

    if (pending) {
      // generate newId
      const { type, assistant } = getResourceSubType(resource);
      const application = pg.application || assistant || type;
      const patchSet = [];

      if (isDataLoader) {
        patchSet.push({ op: 'add', path: '/type', value: 'simple' });
        patchSet.push({ op: 'add', path: '/name', value: 'Data loader' });
      } else {
        patchSet.push({
          op: 'add',
          path: '/application',
          value: application,
        });

        if (pg.webhookOnly && pg.application !== 'webhook') {
          patchSet.push({ op: 'add', path: '/type', value: 'webhook' });
        }

        if (pg._connectionId) {
          // rdbmsAppType refers to specific rdbms application inferred from connection of pending pp
          // used to populate the same when user opens resource form
          patchSet.push(
            {
              op: 'add',
              path: '/_connectionId',
              value: pg._connectionId,
            },
            {
              op: 'add',
              path: '/rdbmsAppType',
              value: rdbmsAppType,
            }
          );
        }
      }

      // for pending resource, passing the PG index in newId
      // which will be used in saga to add or replace the pending resource
      newId = `${newId}.${index}`;
      dispatch(actions.resource.patchStaged(newId, patchSet, 'value'));
    }

    let to = pending
      ? `${match.url}/add/pageGenerator/${newId}`
      : `${match.url}/edit/exports/${pg._exportId}`;

    if (pending && isDataLoader) to = `${match.url}/edit/exports/${newId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }, [
    dispatch,
    history,
    isDataLoader,
    match.isExact,
    match.url,
    pending,
    pg._connectionId,
    pg._exportId,
    pg.application,
    pg.webhookOnly,
    rdbmsAppType,
    resource,
    index
  ]);
  const getApplication = useCallback(() => {
    if (isDataLoader) {
      return {
        connectorType: 'dataLoader',
        blockType: 'dataLoader',
      };
    }

    let blockType;

    if (!pending || resourceId) {
      // even if we have a pending PG, as ling as we have a
      // resource, then the below logic still applies.
      let connectorType = resource.adaptorType || resource.type;

      if (connectorType === 'WebhookExport' || connectorType === 'webhook') {
        if (
          resource.webhook &&
          resource.webhook.provider &&
          resource.webhook.provider !== 'custom'
        ) {
          connectorType = resource.webhook.provider;
        }
      }

      blockType = isRealTimeOrDistributedResource(resource)
        ? 'listener'
        : 'export';

      if (['FTPExport', 'S3Export'].indexOf(resource.adaptorType) >= 0) {
        blockType = 'exportTransfer';
      }

      return {
        connectorType,
        assistant: resource.assistant,
        blockType,
      };
    }
    const applications = applicationsList();

    const app = applications.find(a => a.id === pg.application) || {};

    return {
      connectorType: app.type,
      assistant: app.assistant,
      blockType:
        pg.webhookOnly || isRealTimeOrDistributedResource(resource)
          ? 'listener'
          : 'export',
    };
  }, [
    isDataLoader,
    pending,
    pg.application,
    pg.webhookOnly,
    resource,
    resourceId,
  ]);
  const blockName = pending
    ? 'Pending configuration'
    : resource.name || resource.id;
  const { connectorType, assistant, blockType } = getApplication();

  drag(ref);

  // #region Configure available generator actions

  const generatorActions = useMemo(() => {
    let generatorActions = [];

    if (!pending) {
      if (['export', 'exportTransfer'].indexOf(blockType) >= 0) {
        generatorActions.push({
          ...scheduleAction,
          isUsed: usedActions[actionsMap.schedule],
        });
      }
      if (exportNeedsRouting || connectionHasAs2Routing) {
        generatorActions.push({
          ...as2RoutingAction,
          isUsed: connectionHasAs2Routing || multipleAs2ExportsOfSameConnectionId,
        });
      }
      generatorActions = [
        ...generatorActions,
        {
          ...transformationAction,
          isUsed: usedActions[actionsMap.transformation],
        },
        {
          ...exportFilterAction,
          isUsed: usedActions[actionsMap.outputFilter],
        },
        { ...exportHooksAction, isUsed: usedActions[actionsMap.hooks] },
      ];
    }
    return generatorActions;
  }, [
    blockType,
    connectionHasAs2Routing,
    exportNeedsRouting,
    pending,
    usedActions,
    multipleAs2ExportsOfSameConnectionId
  ]);
  // #endregion
  // console.log('render: <PageGenerator>');

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        integrationId={integrationId}
        name={blockName}
        onDelete={!isDataLoader && onDelete(blockName)}
        onErrors={onErrors}
        isViewMode={isViewMode}
        onBlockClick={handleBlockClick}
        connectorType={connectorType}
        assistant={assistant}
        ref={ref} /* ref is for drag and drop binding */
        blockType={blockType}
        opacity={opacity}
        actions={generatorActions}
        flowId={flowId}
        resource={resource}
        index={index}
        schedule={schedule}
        openErrorCount={openErrorCount}
        isPageGenerator
      />
      <div
        /* -- connecting line */
        className={clsx({
          [classes.line]: !pending,
          [classes.connectingLine]: index > 0 && !pending,
        })}
      />
    </div>
  );
};

export default withRouter(PageGenerator);

import { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useDrag } from 'react-dnd-cjs';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import itemTypes from '../itemTypes';
import AppBlock from '../AppBlock';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import applications from '../../../constants/applications';
import { getResourceSubType, generateNewId } from '../../../utils/resource';
import exportHooksAction from './actions/exportHooks';
import as2RoutingAction from './actions/as2Routing';
import transformationAction from './actions/transformation';
import scheduleAction from './actions/schedule';
import exportFilterAction from './actions/exportFilter';
import { actionsMap } from '../../../utils/flows';

/* the 'block' consts in this file and <AppBlock> should eventually go in the theme. 
   We the block consts across several components and thus is a maintenance issue to 
   manage as we enhance the FB layout. */
const blockHeight = 170;
const lineHeightOffset = 63;
const lineWidth = 130;
const emptyObj = {};
const useStyles = makeStyles(theme => ({
  pgContainer: {
    display: 'flex',
    alignItems: 'center',
    // marginBottom: theme.spacing(3),
  },
  line: {
    borderBottom: `3px dotted ${theme.palette.divider}`,
    width: lineWidth,
    marginTop: 67,
  },
  firstLine: {
    position: 'relative',
  },
  connectingLine: {
    marginTop: -161,
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
  ...pg
}) => {
  const pending = !pg._exportId;
  const resourceId = pg._connectionId || pg._exportId;
  const resourceType = pg._connectionId ? 'connections' : 'exports';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [newGeneratorId, setNewGeneratorId] = useState(null);
  const resource = useSelector(state =>
    !resourceId
      ? emptyObj
      : selectors.resource(state, resourceType, resourceId) || emptyObj
  );
  const exportNeedsRouting = useSelector(state =>
    selectors.exportNeedsRouting(state, resourceId)
  );
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
  const createdGeneratorId = useSelector(state =>
    selectors.createdResourceId(state, newGeneratorId)
  );

  // console.log(pg, usedActions, createdGeneratorId);

  // #region Add Generator on creation effect
  useEffect(() => {
    if (createdGeneratorId) {
      const patchSet = [
        {
          op: 'replace',
          path: `/pageGenerators/${index}`,
          value: { _exportId: createdGeneratorId },
        },
      ];

      dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdGeneratorId, dispatch]);
  // #endregion
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: itemTypes.PAGE_GENERATOR, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isViewMode,
  });
  const opacity = isDragging ? 0.5 : 1;
  const handleBlockClick = useCallback(() => {
    const newId = generateNewId();

    if (pending) {
      // generate newId
      setNewGeneratorId(newId);
      const { type, assistant } = getResourceSubType(resource);
      const application = pg.application || assistant || type;
      const patchSet = [
        {
          op: 'add',
          path: '/application',
          value: application,
        },
      ];

      if (pg.webhookOnly && pg.application !== 'webhook') {
        patchSet.push({ op: 'add', path: '/type', value: 'webhook' });
      }

      // patch it with the connectionId
      if (pg._connectionId) {
        patchSet.push({
          op: 'add',
          path: '/_connectionId',
          value: pg._connectionId,
        });
      }

      // console.log('patchSet: ', patchSet);

      dispatch(actions.resource.patchStaged(newId, patchSet, 'value'));
    }

    const to = pending
      ? `${match.url}/add/exports/${newId}`
      : `${match.url}/edit/exports/${pg._exportId}`;

    if (match.isExact) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }, [
    dispatch,
    history,
    match.isExact,
    match.url,
    pending,
    pg._connectionId,
    pg._exportId,
    pg.application,
    pg.webhookOnly,
    resource,
  ]);

  function getApplication() {
    if (!pending || resourceId) {
      // even if we have a pending PG, as ling as we have a
      // resource, then the below logic still applies.
      return {
        connectorType: resource.adaptorType,
        assistant: resource.assistant,
        blockType:
          resource.adaptorType === 'WebhookExport' ? 'listener' : 'export',
      };
    }

    const app = applications.find(a => a.id === pg.application) || {};

    return {
      connectorType: app.type,
      assistant: app.assistant,
      blockType:
        pg.webhookOnly || resource.type === 'webhook' ? 'listener' : 'export',
    };
  }

  const blockName = pending
    ? 'Pending configuration'
    : resource.name || resource.id;
  const { connectorType, assistant, blockType } = getApplication();

  drag(ref);

  // #region Configure available generator actions
  let generatorActions = [];

  if (!pending) {
    if (blockType === 'export') {
      generatorActions.push({
        ...scheduleAction,
        isUsed: true, // usedActions[actionsMap.schedule],
      });
    }

    if (exportNeedsRouting || connectionHasAs2Routing) {
      generatorActions.push({
        ...as2RoutingAction,
        isUsed: connectionHasAs2Routing,
      });
    }

    generatorActions = [
      ...generatorActions,
      {
        ...transformationAction,
        isUsed: usedActions[actionsMap.transformation],
      },
      { ...exportHooksAction, isUsed: usedActions[actionsMap.hooks] },
      { ...exportFilterAction, isUsed: usedActions[actionsMap.outputFilter] },
    ];
  }
  // #endregion

  // console.log('render: <PageGenerator>');

  return (
    <div className={classes.pgContainer}>
      <AppBlock
        integrationId={integrationId}
        name={blockName}
        onDelete={onDelete}
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

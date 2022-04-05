import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBlock from '../AppBlock';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import {applicationsList} from '../../../constants/applications';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import {isFileAdaptor,
  getResourceSubType,
  generateNewId,
  isRealTimeOrDistributedResource,
} from '../../../utils/resource';
import exportHooksAction from './actions/exportHooks';
import as2RoutingAction from './actions/as2Routing';
import transformationAction from './actions/transformation_afe';
import scheduleAction from './actions/schedule';
import exportFilterAction from './actions/exportFilter_afe';
import { actionsMap } from '../../../utils/flows';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

const emptyObj = {};
const useStyles = makeStyles({
  pgContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
const PageGenerator = ({
  history,
  match,
  index,
  isLast,
  flowId,
  integrationId,
  isViewMode,
  onDelete,
  openErrorCount,
  className,
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
  const allowSchedule = useSelectorMemo(selectors.mkFlowAllowsScheduling, flowId);
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
        _connectionId: resource?._connectionId,
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

  const handleBlockClick = useCallback(() => {
    let newId = generateNewId();

    if (pending) {
      // generate newId
      const { type, assistant } = getResourceSubType(resource);
      const application = pg.application || assistant || type;
      const patchSet = [];

      if (isDataLoader) {
        patchSet.push({ op: 'add', path: '/type', value: 'simple' });
        patchSet.push({ op: 'add', path: '/name', value: 'Data Loader' });
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
      ? buildDrawerUrl({
        path: drawerPaths.RESOURCE.ADD,
        baseUrl: match.url,
        params: { resourceType: 'pageGenerator', id: newId },
      })
      : buildDrawerUrl({
        path: drawerPaths.RESOURCE.EDIT,
        baseUrl: match.url,
        params: { resourceType: 'exports', id: pg._exportId },
      });

    if (pending && isDataLoader) {
      to = buildDrawerUrl({
        path: drawerPaths.RESOURCE.EDIT,
        baseUrl: match.url,
        params: { resourceType: 'exports', id: newId },
      });
    }

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
    index,
  ]);
  const getApplication = useCallback(() => {
    if (isDataLoader) {
      return {
        connectorType: 'dataLoader',
        blockType: 'dataLoader',
      };
    }

    // TODO: move this logic to util function and use "resourceCategory" function
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

      if (isFileAdaptor(resource) && resource.adaptorType.includes('Export')) {
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

  // #region Configure available generator actions

  const generatorActions = useMemo(() => {
    let generatorActions = [];

    if (!pending) {
      if (allowSchedule && ['export', 'exportTransfer'].indexOf(blockType) >= 0) {
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
        // We don't support preSavePage hook incase of Data loader
        ...(
          isDataLoader ? []
            : [{ ...exportHooksAction, isUsed: usedActions[actionsMap.hooks] }]
        ),
      ];
    }

    return generatorActions;
  }, [
    allowSchedule,
    blockType,
    connectionHasAs2Routing,
    exportNeedsRouting,
    pending,
    usedActions,
    multipleAs2ExportsOfSameConnectionId,
    isDataLoader,
  ]);
  // #endregion
  // console.log('render: <PageGenerator>');

  return (
    <div className={clsx(classes.pgContainer, className)}>
      <AppBlock
        integrationId={integrationId}
        name={blockName}
        onDelete={!isDataLoader && onDelete(blockName)}
        isViewMode={isViewMode}
        onBlockClick={handleBlockClick}
        connectorType={connectorType}
        assistant={assistant}
        blockType={blockType}
        actions={generatorActions}
        flowId={flowId}
        resource={resource}
        resourceId={resourceId}
        resourceType="exports"
        index={index}
        schedule={schedule}
        openErrorCount={openErrorCount}
        isPageGenerator
      />
    </div>
  );
};

export default withRouter(PageGenerator);

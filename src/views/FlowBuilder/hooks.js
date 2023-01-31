import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDragDropManager } from 'react-dnd';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import useConfirmDialog from '../../components/ConfirmDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import { emptyObject, GRAPH_ELEMENTS_TYPE, UNASSIGNED_SECTION_ID } from '../../constants';
import { generateNewId } from '../../utils/resource';
import itemTypes from './itemTypes';
import { drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';
import { useFlowContext } from './FlowBuilderBody/Context';
import { generateEmptyRouter, getNewRouterPatchSet, isVirtualRouter } from '../../utils/flows/flowbuilder';
import messageStore from '../../utils/messageStore';

export const isNewFlowFn = flowId => !flowId || flowId?.startsWith('new');
export const usePatchFlow = flowId => {
  const dispatch = useDispatch();

  const isNewFlow = isNewFlowFn(flowId);

  const patchFlow = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));

      if (!isNewFlow) {
        dispatch(actions.flowData.updateFlow(flowId));
      }
    },
    [dispatch, flowId, isNewFlow]
  );

  return patchFlow;
};
export const useHandleDelete = flowId => {
  const { confirmDialog } = useConfirmDialog();
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || {};

  const patchFlow = usePatchFlow(flowId);
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const handleDelete = useCallback(
    type => () => index => {
      confirmDialog({
        title: 'Confirm remove',
        message: messageStore('CONFIRM_REMOVE'),
        buttons: [
          {
            label: 'Remove',
            onClick: () => {
              if (type === itemTypes.PAGE_PROCESSOR) {
                const newOrder = [...pageProcessors];

                newOrder.splice(index, 1);
                patchFlow('/pageProcessors', newOrder);
              }

              if (type === itemTypes.PAGE_GENERATOR) {
                const newOrder = [...pageGenerators];

                newOrder.splice(index, 1);
                patchFlow('/pageGenerators', newOrder);
              }
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    },
    [pageGenerators, pageProcessors, patchFlow, confirmDialog]
  );

  return handleDelete;
};

export const useHandleMovePP = flowId => {
  const patchFlow = usePatchFlow(flowId);
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || {};

  const { pageProcessors = [] } = flow;
  const handleMovePP = useCallback(
    ({oldIndex, newIndex}) => {
      const newOrder = [...pageProcessors];
      const [removed] = newOrder.splice(oldIndex, 1);

      newOrder.splice(newIndex, 0, removed);
      patchFlow('/pageProcessors', newOrder);
    },
    [pageProcessors, patchFlow]
  );

  return handleMovePP;
};

export const useHandleMovePG = flowId => {
  const patchFlow = usePatchFlow(flowId);
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;

  const { pageGenerators = [] } = flow;
  const handleMovePG = useCallback(
    ({oldIndex, newIndex}) => {
      const newOrder = [...pageGenerators];
      const [removed] = newOrder.splice(oldIndex, 1);

      newOrder.splice(newIndex, 0, removed);
      patchFlow('/pageGenerators', newOrder);
    },
    [pageGenerators, patchFlow]
  );

  return handleMovePG;
};

export const usePushOrReplaceHistory = () => {
  const match = useRouteMatch();
  const history = useHistory();

  const pushOrReplaceHistory = useCallback(
    to => {
      if (match.isExact) {
        history.push(to);
      } else {
        history.replace(to);
      }
    },
    [history, match.isExact]
  );

  return pushOrReplaceHistory;
};

export const usePatchNewFlow = integrationId => {
  const dispatch = useDispatch();

  const patchNewFlow = useCallback(
    (newFlowId, flowGroupingId, newName, newPG) => {
      const startDisabled = !newPG || newPG.application !== 'dataLoader';
      const patchSet = [
        { op: 'add', path: '/name', value: newName || 'New flow' },
        { op: 'add', path: '/pageGenerators', value: newPG ? [newPG] : [] },
        { op: 'add', path: '/pageProcessors', value: [] },
        { op: 'add', path: '/disabled', value: startDisabled },
      ];

      if (integrationId && integrationId !== 'none') {
        patchSet.push({
          op: 'add',
          path: '/_integrationId',
          value: integrationId,
        });
      }
      if (flowGroupingId && flowGroupingId !== UNASSIGNED_SECTION_ID) {
        patchSet.push({
          op: 'add',
          path: '/_flowGroupingId',
          value: flowGroupingId,
        });
      }

      dispatch(actions.resource.patchStaged(newFlowId, patchSet));
    },
    [dispatch, integrationId]
  );

  return patchNewFlow;
};
export const useHandleExitClick = () => {
  const history = useHistory();
  const location = useLocation();

  const handleExitClick = useCallback(() => {
    // Note that our App init must do some internal redirects since
    // a new browser tab session always has a history depth of 2!
    // if depth is more than 2, we are safe to just go back in the history queue.
    const parts = location.pathname.split('/');
    const isIARoute = parts[1].toLowerCase() === 'integrationapps';

    // /integrationapps/ShopifyNetSuite/{integrationId}/flowBuilder/{flowId}
    // 6 route segements

    const isRouteInSettingsOrSchedule = parts.some(part => ['settings', 'schedule'].includes(part));

    // if there is history and you are accessing other routes within the flowbuilder such as schedule or settings
    // you should go back twice..the base flowbuilder for IA route has 6 parts..for other Integrations it is 5 parts
    const shouldGoBackTwice = isRouteInSettingsOrSchedule && history.length > 3 && (isIARoute ? parts.length > 6 : parts.length > 5);

    if (shouldGoBackTwice) {
      return history.go(-2);
    }
    if (history.length > 2) {
      return history.goBack();
    }

    // in a no history stack parse the location and return the user to the integration
    // details page.

    if (isIARoute) {
      // if user is editing an IA flow, the url is 1 segment longer.
      return history.push(parts.slice(0, 4).join('/'));
    }

    return history.push(parts.slice(0, 3).join('/'));
  }, [history, location]);

  return handleExitClick;
};

export function useHandleAddGenerator() {
  const match = useRouteMatch();
  const pushOrReplaceHistory = usePushOrReplaceHistory();
  const handleAddGenerator = useCallback(() => {
    const newTempGeneratorId = generateNewId();
    const addPGUrl = buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: match.url,
      params: { resourceType: 'pageGenerator', id: newTempGeneratorId },
    });

    pushOrReplaceHistory(addPGUrl);
  }, [match.url, pushOrReplaceHistory]);

  return handleAddGenerator;
}

export function useHandleAddProcessor() {
  const match = useRouteMatch();
  const pushOrReplaceHistory = usePushOrReplaceHistory();

  const handleAddProcessor = useCallback(() => {
    const newTempProcessorId = generateNewId();
    const addPPUrl = buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: match.url,
      params: { resourceType: 'pageProcessor', id: newTempProcessorId },
    });

    pushOrReplaceHistory(addPPUrl);
  }, [match.url, pushOrReplaceHistory]);

  return handleAddProcessor;
}

export const useHandleAddNode = edgeId => {
  const { elementsMap, flowId } = useFlowContext();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const pushOrReplaceHistory = usePushOrReplaceHistory();

  return () => {
    const edge = elementsMap[edgeId];

    if (!edge) return;
    const newTempProcessorId = generateNewId();

    dispatch(actions.flow.addNewPPStepInfo(flowId, {branchPath: edge.data?.path, processorIndex: edge.data?.processorIndex}));
    const addPPUrl = buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: match.url,
      params: { resourceType: 'pageProcessor', id: newTempProcessorId },
    });

    pushOrReplaceHistory(addPPUrl);
  };
};

export const useHandleRouterClick = routerId => {
  const { flow, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const editorId = `router-${routerId}`;

  return () => {
    const router = flow.routers.find(r => r.id === routerId);
    const routerIndex = flow.routers.findIndex(r => r.id === routerId);
    const userDefinedRouters = flow.routers.filter(r => !isVirtualRouter(r));
    const userDefinedRoutersCount = userDefinedRouters.findIndex(r => r.id === routerId) + 1;

    if (!router) return;
    dispatch(actions.editor.init(editorId, 'router', {
      flowId,
      resourceType: 'flows',
      resourceId: routerId,
      router,
      fieldId: 'router',
      routerIndex,
      branchNamingIndex: userDefinedRoutersCount,
      stage: 'router',
      integrationId: flow?._integrationId,
    }));
    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  };
};

export const useHandleAddNewRouter = edgeId => {
  const { flow, elementsMap, flowId } = useFlowContext();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const originalFlow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);

  const router = generateEmptyRouter();
  const editorId = `router-${router.id}`;

  return () => {
    const {patchSet, routerIndex} = getNewRouterPatchSet({ elementsMap, flow, router, edgeId, originalFlow });

    const edge = elementsMap[edgeId];
    const isInsertingBeforeFirstRouter = elementsMap[edge.source]?.type === GRAPH_ELEMENTS_TYPE.PG_STEP &&
    elementsMap[edge.target]?.type === GRAPH_ELEMENTS_TYPE.ROUTER;
    const userDefinedRoutersCount = flow.routers.filter(r => !isVirtualRouter(r)).length + 1;

    dispatch(actions.editor.init(editorId, 'router', {
      flowId,
      resourceType: 'flows',
      resourceId: router.id,
      router,
      routerIndex,
      integrationId: flow?._integrationId,
      branchNamingIndex: userDefinedRoutersCount,
      fieldId: 'router',
      prePatches: patchSet,
      stage: 'router',
      edge,
      isInsertingBeforeFirstRouter,
    }));
    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  };
};

export const useIsDragInProgress = () => {
  const [dragInProgress, setDragInProgress] = useState(false);
  const clearMonitorSubscription = useRef(null);
  const dragDropManager = useDragDropManager();
  const handleMonitorChange = useCallback(() => {
    setDragInProgress(dragDropManager.getMonitor().isDragging());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragDropManager]);

  useEffect(() => {
    clearMonitorSubscription.current = dragDropManager.getMonitor().subscribeToStateChange(handleMonitorChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => {
    clearMonitorSubscription.current();
  }, []);

  return dragInProgress;
};


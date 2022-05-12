import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useFlowContext } from '../Context';
import actions from '../../../../actions';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { generateEmptyRouter } from '../../../../utils/flows/flowbuilder';

export const useHandleAddNode = edgeId => {
  const { elementsMap, flowId } = useFlowContext();
  const dispatch = useDispatch();

  return () => {
    const edge = elementsMap[edgeId];

    if (!edge) return;
    dispatch(actions.flow.addNewPPStep(flowId, edge.data?.path));
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

    if (!router) return;
    dispatch(actions.editor.init(editorId, 'router', {
      flowId,
      resourceType: 'flows',
      resourceId: flowId,
      router,
      routerIndex,
      stage: 'inputFilter',
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
  const editorId = `router-${edgeId}`;
  const router = generateEmptyRouter();

  return () => {
    const edge = elementsMap[edgeId];

    dispatch(actions.editor.init(editorId, 'router', {
      flowId,
      resourceType: 'flows',
      resourceId: flowId,
      router,
      routerIndex: flow.routers.length + 1,
      integrationId: flow?._integrationId,
      edgeId,
      stage: 'inputFilter',
      edge,
    }));
    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  };
};


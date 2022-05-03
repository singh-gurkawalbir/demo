import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useFlowContext } from '../Context';
import { getNodeInsertionPathForEdge } from '../translateSchema/getPathOfNode';
import actions from '../../../../actions';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { generateEmptyRouter } from '../../../../utils/flows/flowbuilder';

export const useHandleAddNode = edgeId => {
  const { flow, elementsMap } = useFlowContext();
  const dispatch = useDispatch();

  return () => {
    const edge = elementsMap[edgeId];
    const path = getNodeInsertionPathForEdge(flow, edge, elementsMap);

    if (!path) return;

    dispatch(actions.flow.addNewPPStep(flow._id, path));
  };
};

export const useHandleAddNewRouter = edgeId => {
  const {flow, elementsMap} = useFlowContext();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const editorId = `router-${edgeId}`;
  const router = generateEmptyRouter();

  return () => {
    const edge = elementsMap[edgeId];

    dispatch(actions.editor.init(editorId, 'router', {
      flowId: flow?._id,
      resourceType: 'flows',
      resourceId: flow?._id,
      router,
      integrationId: flow?._integrationId,
      edgeId,
      edge,
    }));
    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  };
};


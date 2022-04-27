import { useDispatch } from 'react-redux';
import { useFlowContext } from '../Context';
import { getNodeInsertionPathForEdge } from '../translateSchema/getPathOfNode';
import actions from '../../../../actions';

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

  return () => {
    const edge = elementsMap[edgeId];
    const path = getNodeInsertionPathForEdge(flow, edge, elementsMap);

    if (!path) return;

    dispatch(actions.flow.addNewRouter(flow._id, path));
  };
};


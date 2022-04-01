import { useFlowContext } from '../Context';
import actions from '../reducer/actions';
import { getNodeInsertionPathForEdge, getPathOfPGOrPPNode, isPageGenerator } from '../translateSchema/getPathOfNode';
import { getSomeExport, getSomeImport, getSomePg, getSomePpImport } from '../nodeGeneration';
import { generateId } from '../lib';

const getSomeNode = (id, isPG) => {
  if (isPG) {
    return {
      flowNode: getSomePg(id),
      resourceNode: getSomeExport(id),
    };
  }

  return {
    flowNode: getSomePpImport(id),
    resourceNode: getSomeImport(id),
  };
};

export const useHandleAddNode = edgeId => {
  const {flow, elementsMap, setState} = useFlowContext();

  return () => {
    const edge = elementsMap[edgeId];
    const path = getNodeInsertionPathForEdge(flow, edge, elementsMap);

    if (!path) return;

    const id = `new-${generateId()}`;
    // Assume all pg are exports and all pp are imports
    // This segment of code can change
    const isPG = isPageGenerator(path);
    const {flowNode, resourceNode} = getSomeNode(id, isPG);
    const resourceType = isPG ? 'exports' : 'imports';

    setState({type: actions.ADD_NEW_STEP, resourceType, path, flowNode, resourceNode, flowId: flow._id});
  };
};

export const useHandleAddNewRouter = edgeId => {
  const {flow, elementsMap, setState} = useFlowContext();

  return () => {
    const edge = elementsMap[edgeId];
    const path = getNodeInsertionPathForEdge(flow, edge, elementsMap);

    if (!path) return;

    setState({type: actions.ADD_NEW_ROUTER, flow, path});
  };
};

export const useHandleDeleteNode = nodeId => {
  const { flow, elementsMap, setState } = useFlowContext();

  return () => {
    const node = elementsMap[nodeId];

    const path = getPathOfPGOrPPNode(flow, nodeId);

    if (!path) return;

    setState({type: actions.DELETE_STEP, flow, path, isPageGenerator: node.type === 'pg'});
  };
};

export const useHandleDeleteEdge = edgeId => {
  const { setState } = useFlowContext();

  return () => {
    setState({type: actions.DELETE_EDGE, edgeId});
  };
};

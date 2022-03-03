import { useFlowContext } from '../Context';
import actions from '../reducer/actions';
import { generateNewId } from '../../../../../utils/resource';
import { getNextRouterPathForTerminalNode, getNodeInsertionPathForEdge, isPageGenerator } from '../translateSchema/getPathOfNode';
import { getSomeExport, getSomeImport, getSomePg, getSomePpImport } from '../metadata/nodeGeneration';

const getSomeNode = (id, isPG) => {
  if (isPG) {
    return {
      flowNode: getSomePg(id),
      resourceNode: getSomeExport(id),
    };
  }

  return {flowNode: getSomePpImport(id),
    resourceNode: getSomeImport(id)};
};

export const useHandleAddNode = edgeId => {
  const {flow, elements, setState} = useFlowContext();

  return () => {
    const edge = elements.find(ele => ele.id === edgeId);
    const path = getNodeInsertionPathForEdge(flow, edge);

    if (!path) return;

    const id = `new-${generateNewId()}`;

    // Assume all pg are exports and all pp are imports
    // This segment of code can change
    const isPG = isPageGenerator(path);
    const {flowNode, resourceNode} = getSomeNode(id, isPG);
    const resourceType = isPG ? 'exports' : 'imports';

    setState({type: actions.ADD_NEW_NODE, resourceType, path, flowNode, resourceNode, flowId: flow._id});
  };
};

export const handleMergeNode = (flow, elements, setState) => (sourceTerminalNode, targetTerminalNode) => {
  const edgeForSourceTerminalNode = elements.find(ele => ele.target === sourceTerminalNode);
  const edgeForTargetTerminalNode = elements.find(ele => ele.target === targetTerminalNode);

  const sourcePath = getNextRouterPathForTerminalNode(flow, edgeForSourceTerminalNode);
  const destinationPath = getNextRouterPathForTerminalNode(flow, edgeForTargetTerminalNode);

  setState({type: actions.MERGE_TERMINAL_NODES, flow, sourcePath, destinationPath});
};

export const useHandleAddNewRouter = edgeId => {
  const {flow, elements, setState} = useFlowContext();

  return () => {
    const edge = elements.find(ele => ele.id === edgeId);
    const path = getNodeInsertionPathForEdge(flow, edge);

    if (!path) return;

    setState({type: actions.ADD_NEW_ROUTER, flow, path});
  };
};

export const useHandleDeleteEdge = edgeId => {
  const {flow, elements, setState} = useFlowContext();

  return () => {
    const edge = elements.find(ele => ele.id === edgeId);
    const path = getNextRouterPathForTerminalNode(flow, edge);

    if (!path) return;

    setState({type: actions.DELETE_EDGE, flow, path});
  };
};

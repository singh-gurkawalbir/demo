import { useFlowContext } from '../Context';
import actions from '../reducer/actions';
import { getNextRouterPathForTerminalNode, getNodeInsertionPathForEdge, getPathOfPGOrPPNode, isPageGenerator } from '../translateSchema/getPathOfNode';
import { getSomeExport, getSomeImport, getSomePg, getSomePpImport } from '../nodeGeneration';
import { generateId } from '../lib';

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
    const path = getNodeInsertionPathForEdge(flow, edge, elements);

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
    const path = getNodeInsertionPathForEdge(flow, edge, elements);

    if (!path) return;

    setState({type: actions.ADD_NEW_ROUTER, flow, path});
  };
};

export const useHandleDeleteNode = nodeId => {
  const { flow, elements, setState } = useFlowContext();

  return () => {
    const node = elements.find(ele => ele.id === nodeId);

    const path = getPathOfPGOrPPNode(flow, nodeId);

    if (!path) return;

    setState({type: actions.DELETE_STEP, flow, path, isPageGenerator: node.type === 'pg'});
  };
};

export const useHandleDeleteEdge = edgeId => {
  const {flow, elements, setState} = useFlowContext();

  return () => {
    console.log('useHandleDeleteEdge', edgeId);

    const edge = elements.find(ele => ele.id === edgeId);
    const sourceNode = elements.find(ele => ele.id === edge?.source);
    const isSourceNodeAPG = sourceNode.type === 'pg';
    const path = getNextRouterPathForTerminalNode(flow, edge);
    const sourceNodePath = getPathOfPGOrPPNode(flow, edge?.source);

    if (isSourceNodeAPG) {
      if (sourceNodePath) {
        return setState({type: actions.DELETE_STEP, flow, path: sourceNodePath, isPageGenerator: true});
      }

      return;
    }
    if (!path) return;
    setState({type: actions.DELETE_EDGE, flow, path});
  };
};

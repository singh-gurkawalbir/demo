
import produce from 'immer';
import { getConnectedEdges } from 'react-flow-renderer';
import actions from './actions';
import { generateId, generateDefaultEdge, findNodeIndex } from '../lib';

const generateNewNode = () => {
  const newId = generateId();

  return ({
    id: newId,
    type: 'pp',
    data: { label: `New node: ${newId}`},
  });
};
const generateNewRouter = () => ({
  id: generateId(),
  type: 'router',
});
const generateNewTerminal = () => ({
  id: generateId(),
  type: 'terminal',
});

const generateNewMergeNode = () => ({
  id: generateId(),
  type: 'merge',
});
export const handleAddNewRouter = (edgeId, elements) => {
  const oldEdge = elements.find(el => el.id === edgeId);
  const oldSourceId = oldEdge.source;

  const nodeIndex = elements.findIndex(el => el.id === oldSourceId);
  const newRouter = generateNewRouter();

  const newTerminal = generateNewTerminal();

  elements.splice(nodeIndex, 0, ...[newRouter, newTerminal]);

  const edgeBetweenNodeAndRouter = generateDefaultEdge(oldSourceId, newRouter.id);

  oldEdge.source = newRouter.id;
  const edgeBetweenRouterAndTerminal = generateDefaultEdge(newRouter.id, newTerminal.id);

  elements.push(...[
    edgeBetweenNodeAndRouter,
    edgeBetweenRouterAndTerminal,
  ]);
};
export const handleAddNewNode = (edgeId, elements) => {
  const oldEdge = elements.find(el => el.id === edgeId);
  const oldSourceId = oldEdge.source;
  const oldTargetId = oldEdge.target;
  const nodeIndex = elements.findIndex(el => el.id === oldSourceId);

  const newNode = generateNewNode();

  oldEdge.target = newNode.id;

  elements.splice(nodeIndex, 0, newNode);
  elements.push(
    generateDefaultEdge(newNode.id, oldTargetId)
  );
};
const mergeWithMergeNode = (mergeNode, terminalNode, draft) => {
  const targetIndex = findNodeIndex(terminalNode, draft);

  const terminalEdge = getConnectedEdges([terminalNode], draft);

  terminalEdge[0].target = mergeNode.id;
  draft.splice(targetIndex, 1);
};

const mergeTwoTerminalNodes = (terminalNode1, terminalNode2, draft) => {
  const newTerminal = generateNewTerminal();
  const mergeNode = generateNewMergeNode();

  draft.splice(findNodeIndex(terminalNode1.id, draft), 0, ...[mergeNode, newTerminal]);

  draft.splice(findNodeIndex(terminalNode1.id, draft), 1); // delete
  draft.splice(findNodeIndex(terminalNode2.id, draft), 1); // delete
  const edges = getConnectedEdges([terminalNode1, terminalNode2], draft);

  edges[0].target = mergeNode.id;
  edges[1].target = mergeNode.id;

  // Added edges
  draft.push(generateDefaultEdge(mergeNode.id, newTerminal.id));
  // add merge and terinalNode
};

const removeNode = (nodeId, draft) => {
  const precceedingEdgeIndex = draft.findIndex(ele => ele.target === nodeId);
  const succeedingEdgeIndex = draft.findIndex(ele => ele.source === nodeId);
  const nodeAfter = draft[succeedingEdgeIndex].target;

  draft[precceedingEdgeIndex].target = nodeAfter;

  draft.splice(findNodeIndex(nodeId, draft), 1);
  draft.splice(draft.findIndex(ele => ele.source === nodeId), 1);
};
const deleteEdge = (edgeId, draft) => {
  const edgeIndex = draft.findIndex(ele => ele.id === edgeId);
  const restoreTerminal = generateNewTerminal();
  const edge = draft[edgeIndex];
  const mergeNodeId = edge.target;

  edge.target = restoreTerminal.id;
  const sourceIndex = findNodeIndex(edge.source, draft);

  draft.splice(sourceIndex, 0, restoreTerminal);

  // check if merge node need to be deleted
  const shouldDeleteMergeNode = draft.filter(edge => edge.target === mergeNodeId).length === 1;

  if (shouldDeleteMergeNode) {
    removeNode(mergeNodeId, draft);
  }
};
export default function (state, action) {
  const {type, edgeId, source, target} = action;

  return produce(state, draft => {
    switch (type) {
      case actions.MERGE_TERMINAL_NODES: {
        const sourceIndex = findNodeIndex(source, draft);
        const sourceNode = draft[sourceIndex];
        const targetIndex = findNodeIndex(target, draft);
        const targetNode = draft[targetIndex];

        // For merges to a merge node
        if (sourceNode.type === 'merge') {
          mergeWithMergeNode(sourceNode, targetNode, draft);

          return;
        }

        if (targetNode.type === 'merge') {
          mergeWithMergeNode(targetNode, sourceNode, draft);

          return;
        }
        // For terminalNode merges

        mergeTwoTerminalNodes(sourceNode, targetNode, draft);

        return;
      }
      case actions.ADD_NEW_STEP: {
        handleAddNewNode(edgeId, draft);

        return;
      }
      case actions.ADD_NEW_ROUTER: {
        handleAddNewRouter(edgeId, draft);

        return;
      }
      case actions.DELETE_EDGE: {
        deleteEdge(edgeId, draft);

        return;
      }
      default:
        return draft;
    }
  });
}


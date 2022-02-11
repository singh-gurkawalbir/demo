
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
const mergeWithTerminalNode = (mergeNode, terminalNode, draft) => {
  const targetIndex = findNodeIndex(terminalNode, draft);

  const terminalEdge = getConnectedEdges([terminalNode], draft);

  terminalEdge[0].target = mergeNode.id;
  draft.splice(targetIndex, 1);
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

        if (sourceNode.type === 'merge') {
          mergeWithTerminalNode(sourceNode, targetNode, draft);

          return;
        }

        if (targetNode.type === 'merge') {
          mergeWithTerminalNode(targetNode, sourceNode, draft);

          return;
        }
        const newMergeNode = {
          id: generateId(),
          type: 'merge',
        };

        const edges = getConnectedEdges([sourceNode, targetNode], draft);

        console.log('edges', JSON.stringify(edges));

        edges[0].target = newMergeNode.id;
        edges[1].target = newMergeNode.id;

        draft[sourceIndex] = newMergeNode; // replace
        draft.splice(targetIndex, 1); // delete

        return;
      }
      case actions.ADD_NEW_NODE: {
        handleAddNewNode(edgeId, draft);

        return;
      }
      case actions.ADD_NEW_ROUTER: {
        handleAddNewRouter(edgeId, draft);

        return;
      }
      default:
        return draft;
    }
  });
}


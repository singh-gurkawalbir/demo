import produce from 'immer';
import { generateId, generateNewNode, generateDefaultEdge } from '../lib';

const generateNewRouter = () => ({
  id: generateId(),
  type: 'router',
});
const generateNewTerminal = () => ({
  id: generateId(),
  type: 'terminal',
});

export const handleAddNewRouter = (edgeId, elements) =>
  produce(elements,
    draft => {
      const oldEdge = elements.find(el => el.id === edgeId);
      const oldSourceId = oldEdge.source;

      const nodeIndex = elements.findIndex(el => el.id === oldSourceId);
      const newRouter = generateNewRouter();

      const newTerminal = generateNewTerminal();

      draft.splice(nodeIndex, 0, ...[newRouter, newTerminal]);

      const edgeBetweenNodeAndRouter = generateDefaultEdge(oldSourceId, newRouter.id);

      oldEdge.source = newRouter.id;
      const edgeBetweenRouterAndTerminal = generateDefaultEdge(newRouter.id, newTerminal.id);

      draft.push(...[
        edgeBetweenNodeAndRouter,
        edgeBetweenRouterAndTerminal,
      ]);
    });
export const handleAddNewNode = (edgeId, elements) => produce(elements, draft => {
  const oldEdge = elements.find(el => el.id === edgeId);
  const oldSourceId = oldEdge.source;
  const oldTargetId = oldEdge.target;
  const nodeIndex = elements.findIndex(el => el.id === oldSourceId);

  const newNode = generateNewNode();

  oldEdge.target = newNode.id;

  draft.splice(nodeIndex, 0, newNode);
  draft.push(
    generateDefaultEdge(newNode.id, oldTargetId)
  );
});

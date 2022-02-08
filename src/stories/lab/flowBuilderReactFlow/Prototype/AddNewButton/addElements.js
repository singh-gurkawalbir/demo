import produce from 'immer';
import { v4 } from 'uuid';

const generateId = () => v4().replace(/-/g, '').substring(0, 4);
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
const generateNewEdge = (fromId, toId) => ({
  id: `${fromId}-${toId}`,
  source: fromId,
  target: toId,
  type: 'default',
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

      const edgeBetweenNodeAndRouter = generateNewEdge(oldSourceId, newRouter.id);

      oldEdge.source = newRouter.id;
      const edgeBetweenRouterAndTerminal = generateNewEdge(newRouter.id, newTerminal.id);

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
    generateNewEdge(newNode.id, oldTargetId)
  );
});

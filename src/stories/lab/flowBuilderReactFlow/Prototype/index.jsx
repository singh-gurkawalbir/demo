import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider } from 'react-flow-renderer';
import mockElements from './metadata/elements';
import LinkedEdge from './CustomEdges/LinkedEdge';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalNode from './CustomNodes/TerminalNode';
import RouterNode from './CustomNodes/RouterNode';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminal: TerminalNode,
  router: RouterNode,
};

const edgeTypes = {
  default: DefaultEdge,
  linked: LinkedEdge, // not used now, possibly never.
};

export default () => {
  const [elements, setElements] = useState(mockElements);

  const updatedLayout = useMemo(() =>
    layoutElements(elements, 'LR'),
  [elements]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(elements);
  }, [elements]);

  const onNodeDragStart = (e, node) => {
    if (node.type !== 'terminal') {
      return;
    }
    setElements(elements => elements.map(ele => {
      if (ele.type !== 'terminal' || ele.id === node.id) {
        return ele;
      }

      return {...ele, highlight: true};
    }));
  };

  const onNodeDragStop = (e, node) => {
    if (node.type !== 'terminal') {
      return;
    }
    console.log('check ', e);
    setElements(elements => elements.map(ele => {
      if (ele.type !== 'terminal' || ele.id === node.id) {
        return ele;
      }
      const copy = {...ele};

      delete copy.highlight;

      return copy;
    }));
  };

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} setElements={setElements}>
        <ReactFlow
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          elements={updatedLayout}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        />
      </FlowProvider>
      <MiniMap />
      <Controls />
    </ReactFlowProvider>
  );
};

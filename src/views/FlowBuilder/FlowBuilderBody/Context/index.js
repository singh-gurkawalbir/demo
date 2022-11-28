import React, { useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ReactFlowProvider } from 'react-flow-renderer';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, elementsMap, flow, flowId, dragNodeId }) => (
  <DndProvider backend={HTML5Backend}>
    <ReactFlowProvider>
      <FlowContext.Provider
        value={{ elements, elementsMap, flow, dragNodeId, flowId }}>
        {children}
      </FlowContext.Provider>
    </ReactFlowProvider>
  </DndProvider>
);

export function useFlowContext() {
  return useContext(FlowContext);
}

export default {
  FlowProvider,
  useFlowContext,
};

import React, { useContext } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, elementsMap, flow, flowId, dragNodeId, translateExtent }) => (
  <ReactFlowProvider>
    <FlowContext.Provider
      value={{ elements, elementsMap, flow, dragNodeId, flowId, translateExtent }}>
      {children}
    </FlowContext.Provider>
  </ReactFlowProvider>
);

export function useFlowContext() {
  return useContext(FlowContext);
}

export default {
  FlowProvider,
  useFlowContext,
};

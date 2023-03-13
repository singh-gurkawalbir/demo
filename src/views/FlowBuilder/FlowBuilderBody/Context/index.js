import React, { useContext } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, elementsMap, flow, flowId, dragNodeId, translateExtent, flowHighlighter, upstreamHighlighter }) => (
  <ReactFlowProvider>
    <FlowContext.Provider
      value={{ elements, elementsMap, flow, dragNodeId, flowId, translateExtent, flowHighlighter, upstreamHighlighter }}>
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

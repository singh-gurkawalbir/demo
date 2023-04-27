import React, { useContext } from 'react';
import { ReactFlowProvider } from 'reactflow';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, elementsMap, flow, flowId, dragNodeId, translateExtent, downstreamHighlighter, upstreamHighlighter }) => (
  <ReactFlowProvider>
    <FlowContext.Provider
      value={{ elements, elementsMap, flow, dragNodeId, flowId, translateExtent, downstreamHighlighter, upstreamHighlighter }}>
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

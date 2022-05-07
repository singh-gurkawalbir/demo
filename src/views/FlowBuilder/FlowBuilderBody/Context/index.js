import React, { useContext } from 'react';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, elementsMap, flow, flowId, dragNodeId }) => (
  <FlowContext.Provider
    value={{ elements, elementsMap, flow, dragNodeId, flowId }}>
    {children}
  </FlowContext.Provider>
);

export function useFlowContext() {
  return useContext(FlowContext);
}

export default {
  FlowProvider,
  useFlowContext,
};

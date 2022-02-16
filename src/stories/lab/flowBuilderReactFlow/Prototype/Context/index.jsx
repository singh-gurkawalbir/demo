import React, { useContext } from 'react';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, dispatchFlowUpdate, mergeNodeId }) => (
  <FlowContext.Provider
    value={{ elements, dispatchFlowUpdate, mergeNodeId }}>
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

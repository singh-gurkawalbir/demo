import React, { useContext } from 'react';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, setElements, mergeNodeId }) => (
  <FlowContext.Provider
    value={{ elements, setElements, mergeNodeId }}>
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

import React, { useContext } from 'react';

const FlowContext = React.createContext();

export const FlowProvider = ({ children, elements, flow, setState, dragNodeId }) => (
  <FlowContext.Provider
    value={{ elements, setState, flow, dragNodeId }}>
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

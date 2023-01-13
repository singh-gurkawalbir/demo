import { render, screen } from '@testing-library/react';
import React from 'react';
import { FlowProvider, useFlowContext } from '.';

let a;
let b;
let c;
let d;
let e;

function initContext() {
  const DummyComponent = () => {
    const x = useFlowContext();

    a = x.flow;
    b = x.elements;
    c = x.elementsMap;
    d = x.dragNodeId;
    e = x.flowId;

    return (
      <div>
        Hi...
      </div>
    );
  };

  const ui = (
    <FlowProvider
      flow={{test: 'testflow'}} elements={{elements: 'test elements'}} elementsMap={{elementsMap: 'test element map'}} flowId="123"
      dragNodeId="234" >
      <DummyComponent />
    </FlowProvider>
  );

  return render(
    ui
  );
}
describe('Testsuite for context', () => {
  test('should test the context by passing props', () => {
    initContext();
    expect(screen.getByText(/hi.../i)).toBeInTheDocument();
    expect(a).toEqual({ test: 'testflow' });
    expect(b).toEqual({elements: 'test elements'});
    expect(c).toEqual({elementsMap: 'test element map'});
    expect(d).toBe('234');
    expect(e).toBe('123');
  });
});

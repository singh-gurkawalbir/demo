
import { render, screen } from '@testing-library/react';
import React from 'react';
import DefaultHandle from './DefaultHandle';

jest.mock('reactflow', () => ({
  __esModule: true,
  ...jest.requireActual('reactflow'),
  Handle: props => (
    <div>
      <div>Mock React Flow renderer class name = {props.className}</div>
      <div>Mock React Flow renderer props = {props.test}</div>
    </div>
  ),
}));
describe('Testsuite for Default Handle', () => {
  test('should test DOM when the props that are passed to default handle', () => {
    render(
      <DefaultHandle className="Test Class Name" {...{test: 'test1'}} />
    );
    expect(screen.getByText(/mock react flow renderer class name = makestyles-defaulthandle-1 test class name/i)).toBeInTheDocument();
    expect(screen.getByText(/mock react flow renderer props = test1/i)).toBeInTheDocument();
  });
  test('should test DOM when props are not passed', () => {
    render(
      <DefaultHandle className="Test Class Name" />
    );
    expect(screen.getByText(/mock react flow renderer props =/i)).toBeInTheDocument();
  });
});

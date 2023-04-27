import { screen } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import TerminalNode from '.';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import * as mockContext from '../../Context';
import actions from '../../../../../actions';

let initialStore;

function initTerminalNode({ id, data, asyncStatus }) {
  mutateStore(initialStore, draft => {
    draft.session.asyncTask = {
      '234-flow_save_async_key': {
        status: asyncStatus,
      },
    };
  });
  const ui = (
    <TerminalNode id={id} data={data} />
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('../Handles/DefaultHandle', () => ({
  __esModule: true,
  ...jest.requireActual('../Handles/DefaultHandle'),
  default: props => (
    <div>
      <div>Mock DefaultHandle {props.type} {props.position}</div>
    </div>
  ),
}));
describe('Testsuite for TerminalNode', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  test('should test diamond merge icon by mouse hover and unhover', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      dragNodeId: '789', flowId: '234', elements: [{ target: '123', source: '456' }], elementsMap: { 456: { type: 'router' } },
    });
    initTerminalNode({ id: '123', data: { name: 'test name', draggable: true }, asyncStatus: 'completed' });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    const svgNode = document.querySelector('div > div > svg > path');

    expect(svgNode).toBeInTheDocument();
    await userEvent.hover(svgNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.mergeTargetSet('234', 'node', '123'));
    await userEvent.unhover(svgNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.mergeTargetClear('234'));
  });
  test('should test the merge icon when the drag is inprogress', () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      dragNodeId: '123', flowId: '234', elements: [{ target: '123', source: '456' }], elementsMap: { 456: { type: 'router' } },
    });
    initTerminalNode({ id: '123', data: { name: 'test name', draggable: true }, asyncStatus: 'completed' });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/test name/i)).toBeInTheDocument();
    const mergeiconNode = document.querySelector('svg');

    expect(mergeiconNode).toHaveAttribute('class', expect.stringContaining('makeStyles-dragging-'));
  });
  test('should test the merge icon when the drag is not inprogress and is able to drag', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      dragNodeId: '987', flowId: '234', elements: [{ target: '123', source: '456' }], elementsMap: { 456: { type: 'router' } },
    });
    initTerminalNode({ id: '123', data: { name: 'test name', draggable: true }, asyncStatus: 'loading' });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/test name/i)).toBeInTheDocument();

    expect(screen.getByLabelText('Drag to merge with other branch')).toBeInTheDocument();
  });
  test('should test the merge icon when the drag is not inprogress and not able to drag', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      dragNodeId: '987', flowId: '234', elements: [{ target: '123', source: '456' }], elementsMap: { 456: { type: 'router' } },
    });
    initTerminalNode({ id: '123', data: { name: 'test name', draggable: false }, asyncStatus: 'loading' });
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/test name/i)).toBeInTheDocument();

    expect(screen.getByLabelText('Merging to another branch is not possible here because your flow does not contain any branches or because there are no merge targets available. Add branching to your flow or modify your current flow layout to allow merging.')).toBeInTheDocument();
  });
});

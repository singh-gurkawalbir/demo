
import { screen } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import MergeNode from '.';
import { getCreatedStore } from '../../../../../store';
import { renderWithProviders } from '../../../../../test/test-utils';
import * as mockContext from '../../Context';
import actions from '../../../../../actions';

let initialStore;

function initMergeNode({id, data, asyncStatus}) {
  initialStore.getState().session.asyncTask = {
    '234-flow_save_async_key': {
      status: asyncStatus,
    },
  };
  const ui = (
    <MergeNode id={id} data={data} />
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../Handles/DefaultHandle', () => ({
  __esModule: true,
  ...jest.requireActual('../Handles/DefaultHandle'),
  default: props => (
    <div>Mock DefaultHandle {props.type} {props.position}</div>
  ),
}));
jest.mock('../../DiamondMergeIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../DiamondMergeIcon'),
  default: props => (
    <>
      <div>Mock Diamond Merge Icon</div>
      <div>isDroppable = {props.isDroppable}</div>
      <div>tooltip = {props.tooltip}</div>
    </>
  ),
}));
jest.mock('../../../../../utils/messageStore', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../utils/messageStore'),
  default: jest.fn().mockReturnValue('Mock message store'),
}));
describe('Testsuite for MergeNode', () => {
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
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test merge node by hover and unhover on the mergenode', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      dragNodeId: '789', flowId: '234',
    });
    initMergeNode({id: '123', data: {mergableTerminals: ['789']}});
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/mock diamond merge icon/i)).toBeInTheDocument();
    expect(screen.getByText(/isdroppable =/i)).toBeInTheDocument();
    expect(screen.getByText(/tooltip = mock message store/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    const mergeNode = document.querySelector('div[data-test="mergenode"]');

    expect(mergeNode).toBeInTheDocument();
    await userEvent.hover(mergeNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.mergeTargetSet('234', 'node', '123'));
    await userEvent.unhover(mergeNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.mergeTargetClear('234'));
  });
  test('should test merge node not passing props and by hover and unhover on the mergenode', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      dragNodeId: '789', flowId: '234',
    });
    initMergeNode({});
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/mock diamond merge icon/i)).toBeInTheDocument();
    expect(screen.getByText(/isdroppable =/i)).toBeInTheDocument();
    expect(screen.getByText(/tooltip = mock message store/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    const mergeNode = document.querySelector('div[data-test="mergenode"]');

    expect(mergeNode).toBeInTheDocument();
    await userEvent.hover(mergeNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.mergeTargetSet('234', 'node'));
    await userEvent.unhover(mergeNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.mergeTargetClear('234'));
  });
});

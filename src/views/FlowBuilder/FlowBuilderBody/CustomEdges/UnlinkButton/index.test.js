
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import UnlinkButton from '.';
import { getCreatedStore } from '../../../../../store';
import { renderWithProviders } from '../../../../../test/test-utils';
import * as mockContext from '../../Context';
import actions from '../../../../../actions';

jest.mock('../../../../../components/icons/unLinkedIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/icons/unLinkedIcon'),
  default: () => (
    <div>Mock Unlink Icon</div>
  ),
}));
describe('Testsuite for Unlink Button', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'FLOW_DELETE_EDGE':
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test unlink merge button by passing edge id in the props', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({flowId: '234'});

    await renderWithProviders(
      <UnlinkButton edgeId="123" />, initialStore
    );
    expect(screen.getByText(/mock unlink icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const unmergeButtonNode = screen.getByRole('button', {
        name: /unmerge branch/i,
      });

      expect(unmergeButtonNode).toBeInTheDocument();
      await userEvent.click(unmergeButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.deleteEdge('234', '123'));
    });
  });
  test('should test unlink merge button when no edge id passed in the props', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({flowId: '234'});

    await renderWithProviders(
      <UnlinkButton edgeId="" />, initialStore
    );
    expect(screen.getByText(/mock unlink icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const unmergeButtonNode = screen.getByRole('button', {
        name: /unmerge branch/i,
      });

      expect(unmergeButtonNode).toBeInTheDocument();
      await userEvent.click(unmergeButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.deleteEdge('234', ''));
    });
  });
  test('should test unlink merge button when no edge id passed in the props and no flow id from flow context', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({flowId: ''});

    await renderWithProviders(
      <UnlinkButton edgeId="" />, initialStore
    );
    expect(screen.getByText(/mock unlink icon/i)).toBeInTheDocument();
    waitFor(async () => {
      const unmergeButtonNode = screen.getByRole('button', {
        name: /unmerge branch/i,
      });

      expect(unmergeButtonNode).toBeInTheDocument();
      await userEvent.click(unmergeButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.deleteEdge('', ''));
    });
  });
});

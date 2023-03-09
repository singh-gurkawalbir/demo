import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import RouterNode from '.';
import { getCreatedStore } from '../../../../../store';

const mockUseHandleRouterClick = jest.fn();
const mockNoRouterUseHandleRouterClick = jest.fn();

jest.mock('../../Context', () => ({
  __esModule: true,
  ...jest.requireActual('../../Context'),
  useFlowContext: () => ({ flowId: 'flow-123'}),
}));
jest.mock('../../../hooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../hooks'),
  useHandleRouterClick: props => {
    if (props) return mockUseHandleRouterClick;
    if (!props) return mockNoRouterUseHandleRouterClick;
  },
}));
jest.mock('../Handles/DefaultHandle', () => ({
  __esModule: true,
  ...jest.requireActual('../Handles/DefaultHandle'),
  default: props => (
    <div>
      <div>Mock DefaultHandle {props.type} {props.position}</div>
    </div>
  ),
}));
describe('Testsuite for RouterNode', () => {
  afterEach(() => {
    mockUseHandleRouterClick.mockClear();
    mockNoRouterUseHandleRouterClick.mockClear();
  });
  test('should test the All edit branching button when the routeRecordsTo has set to all matching branches', async () => {
    renderWithProviders(
      <RouterNode id="123" data={{routeRecordsTo: 'all_matching_branches'}} />
    );
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    expect(screen.getByText(/all/i)).toBeInTheDocument();
    const allEditBranchingButtonNode = screen.getByRole('button', {
      name: /edit branching/i,
    });

    expect(allEditBranchingButtonNode).toBeInTheDocument();
    await userEvent.click(allEditBranchingButtonNode);
    expect(mockUseHandleRouterClick).toHaveBeenCalledTimes(1);
  });
  test('should test the 1st branching button when the routeRecordsTo has not set to all matching branches', async () => {
    renderWithProviders(
      <RouterNode id="123" data={{routeRecordsTo: 'test'}} />
    );
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    expect(screen.getByText(/1st/i)).toBeInTheDocument();
    const allEditBranchingButtonNode = screen.getByRole('button', {
      name: /edit branching/i,
    });

    expect(allEditBranchingButtonNode).toBeInTheDocument();
    expect(allEditBranchingButtonNode).toBeEnabled();
    await userEvent.click(allEditBranchingButtonNode);
    expect(mockUseHandleRouterClick).toHaveBeenCalledTimes(1);
  });
  test('should test the router node when there is no id and data passed in props', async () => {
    renderWithProviders(
      <RouterNode id="" />
    );
    expect(screen.getByText(/mock defaulthandle target left/i)).toBeInTheDocument();
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    expect(screen.getByText(/1st/i)).toBeInTheDocument();
    const allEditBranchingButtonNode = screen.getByRole('button', {
      name: /edit branching/i,
    });

    expect(allEditBranchingButtonNode).toBeInTheDocument();
    await userEvent.click(allEditBranchingButtonNode);
    expect(mockNoRouterUseHandleRouterClick).toHaveBeenCalledTimes(1);
  });
  test('should not be able to open branching settings while flow saving is in progress', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.asyncTask['flow-123-flow_save_async_key'] = { status: 'loading' };
    });

    renderWithProviders(<RouterNode id="123" data={{routeRecordsTo: 'test'}} />, {initialStore});
    expect(screen.getByRole('button', { name: 'Edit branching' })).toBeDisabled();
  });
});

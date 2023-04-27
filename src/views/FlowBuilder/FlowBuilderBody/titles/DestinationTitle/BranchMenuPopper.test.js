import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import BranchMenuPopper from './BranchMenuPopper';
import { getCreatedStore } from '../../../../../store';
import actions from '../../../../../actions';
import * as utils from '../../../../../utils/resource';
import * as mockGetAllFlowBranches from '../../lib';

let initialStore;
let mockDispatchFn;
let useDispatchSpy;
const mockhandleClose = jest.fn();
const mockHistoryPush = jest.fn();

function initBranchMenuPopper(flowData, anchorEl, handleClose) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [
        {
          _id: 'import_id',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      exports: [
        {
          _id: 'export_id_1',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      connections: [
        {
          _id: 'connection_id',
          type: 'type',
          adaptorType: 'NetSuiteExport',
        },
      ],
      flows: flowData,
    };
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test'}]}
    >
      <Route
        path="/test"
      >
        <BranchMenuPopper anchorEl={anchorEl} handleClose={handleClose} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../Context', () => ({
  __esModule: true,
  ...jest.requireActual('../../Context'),
  useFlowContext: jest.fn().mockReturnValue({
    flow: {_integrationId: 'integration_id'},
    flowId: 'flow_id',
    elements: [{
      id: 'elements_id',
      type: 'router',
      data: {
        path: '/routers/1',
      },
    }],
  }),
}));
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
describe('Testsuite for BranchMenuPopper', () => {
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
    mockHistoryPush.mockClear();
    mockhandleClose.mockClear();
  });
  test('should test the Branch Menu by clicking an menu item and verify the action call made', async () => {
    jest.spyOn(mockGetAllFlowBranches, 'getAllFlowBranches').mockReturnValue([{
      id: 'branch_id',
      name: 'Branch 1.0',
      path: '/routers/1/branches/0',
    }]);
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initBranchMenuPopper([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
      },
    ], 'testing anchorEl', mockhandleClose);
    const headingNode = screen.getByRole('heading', {name: 'Select branch to add to'});

    expect(headingNode).toBeInTheDocument();
    const branchNodeMenuItem = screen.getByRole('menuitem', {name: 'Branch 1.0'});

    expect(branchNodeMenuItem).toBeInTheDocument();
    await userEvent.click(branchNodeMenuItem);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.addNewPPStepInfo('flow_id', {branchPath: '/routers/1/branches/0'}));
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/add/pageProcessor/somegeneratedID');
    expect(mockhandleClose).toHaveBeenCalled();
  });
  test('should test the Branch Menu when there is no anchorEl passed in props', () => {
    jest.spyOn(mockGetAllFlowBranches, 'getAllFlowBranches').mockReturnValue([{
      id: 'branch_id',
      name: 'Branch 1.0',
      path: '/routers/1/branches/0',
    }]);
    const {utils} = initBranchMenuPopper([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
      },
    ], '', mockhandleClose);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test the Branch Menu when there is are no branches', async () => {
    jest.spyOn(mockGetAllFlowBranches, 'getAllFlowBranches').mockReturnValue([]);
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initBranchMenuPopper([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
      },
    ], 'testing anchorEl', mockhandleClose);
    const headingNode = screen.getByRole('heading', {name: 'Select branch to add to'});

    expect(headingNode).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', {name: 'Branch 1.0'})).not.toBeInTheDocument();
    const tooltipNode = screen.getByRole('tooltip', {name: 'Select branch to add to'});

    expect(tooltipNode).toBeInTheDocument();
    await userEvent.click(tooltipNode);
    await waitFor(() => expect(mockhandleClose).toHaveBeenCalled());
  });
});

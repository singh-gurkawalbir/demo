import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import DestinationTitle from '.';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import * as utils from '../../../../../utils/resource';
import * as mockGetAllFlowBranches from '../../lib';
import actions from '../../../../../actions';

let initialStore;
const mockHistoryPush = jest.fn();

function initDestinationTile(flowData) {
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
    <MemoryRouter initialEntries={[{pathname: '/test'}]} >
      <Route path="/test">
        <DestinationTitle />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../../Context', () => ({
  __esModule: true,
  ...jest.requireActual('../../Context'),
  useFlowContext: jest.fn().mockReturnValue({flow: {_integrationId: 'integration_id'}, flowId: 'flow_id'}),
}));
jest.mock('reactflow', () => ({
  __esModule: true,
  ...jest.requireActual('reactflow'),
  // eslint-disable-next-line no-sparse-arrays
  useStore: jest.fn().mockReturnValue([100, , 100]),
}));
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('../Title', () => ({
  __esModule: true,
  ...jest.requireActual('../Title'),
  default: props => (
    <div>
      <button className={props.className} type="button" onClick={props.onClick}>
        {props.children}
      </button>
    </div>
  ),
}));
jest.mock('./BranchMenuPopper', () => ({
  __esModule: true,
  ...jest.requireActual('./BranchMenuPopper'),
  default: props => (
    <div>
      <div>
        <button onClick={() => props.anchorEl} type="button">Open menu</button>
        {props.anchorEl && (
        <menu>
          <li>Menu item 1</li>
        </menu>
        )}
      </div>
      <button type="button" onClick={props.handleClose}>OnClose</button>
    </div>
  ),
}));

let mockDispatchFn;
let useDispatchSpy;

describe('Testsuite for Destination Tile', () => {
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
  });
  test('should test the destination title when the flow is not of type data loader and click on destination title button and verify the url generated when there are no branches attached to the flow', async () => {
    jest.spyOn(mockGetAllFlowBranches, 'getAllFlowBranches').mockReturnValue([]);
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initDestinationTile([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
      },
    ]);
    const destinationAndLookupButtonNode = screen.getByRole('button', {name: 'DESTINATIONS & LOOKUPS'});

    expect(destinationAndLookupButtonNode).toBeInTheDocument();
    await userEvent.click(destinationAndLookupButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/add/pageProcessor/somegeneratedID');
  });
  test('should test the destination title when the flow is not of type data loader and click on destination title button and verify the action call made when there are branches attached to the flow', async () => {
    jest.spyOn(mockGetAllFlowBranches, 'getAllFlowBranches').mockReturnValue([{
      path: '/testingPath',
    }]);
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initDestinationTile([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
        routers: [{
          path: '/testingPath',
        }],
      },
    ]);
    const destinationAndLookupButtonNode = screen.getByRole('button', {name: 'DESTINATIONS & LOOKUPS'});

    expect(destinationAndLookupButtonNode).toBeInTheDocument();
    await userEvent.click(destinationAndLookupButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.addNewPPStepInfo('flow_id', { branchPath: '/testingPath' }));
  });
  test('should test the destination title when the flow is of type data loader and click on destination title button and verify the menu items when there are routers and no branches attached to the flow and click menuitems close button', async () => {
    jest.spyOn(mockGetAllFlowBranches, 'getAllFlowBranches').mockReturnValue([]);
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
    initDestinationTile([
      {
        _id: 'flow_id',
        _connectorId: 'connector_id_1',
        pageGenerators: [{
          application: 'dataLoader',
        }],
        routers: [{
          path: '/testingPath',
        }],
      },
    ]);
    const destinationApplicationButtonNode = screen.getByRole('button', {name: 'DESTINATION APPLICATION'});

    expect(destinationApplicationButtonNode).toBeInTheDocument();
    await userEvent.click(destinationApplicationButtonNode);
    expect(screen.getByText('Menu item 1')).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: 'OnClose'});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(screen.queryByText('Menu item 1')).not.toBeInTheDocument();
  });
});

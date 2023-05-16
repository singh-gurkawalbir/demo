
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import FlowgroupDrawer from '.';
import actions from '../../../actions';
import { runServer } from '../../../test/api/server';
import types from '../../../actions/types';
import customCloneDeep from '../../../utils/customCloneDeep';

const props = {
  integrationId: '_integrationId',
};
let mockState = '/';
const mockHistoryGoBack = jest.fn();
const mockHistoryReplace = jest.fn();

async function initFlowgroupDrawer({props = {}, isEdit = false, addFlow = false}, status = 'Completed') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.form = {
      'flow-flowgroup': {
        disabled: false,
        fields: {
          name: {
            id: 'name',
            type: 'flowgroupname',
            label: 'Name',
            integrationId: props.integrationId,
            flowIds: [],
            touched: false,
          },
          _flowIds: {
            id: '_flowIds',
            type: 'flowstiedtointegrations',
            label: 'Flows',
            placeholder: 'Add flows',
            touched: false,
            integrationId: props.integrationId,
          },
        },
      },
    };
    draft.session.integrations = {
      _integrationId: {
        flowGroupStatus: {
          status,
          message: '',
        },
      },
    };
    draft.data.resources = {
      integrations: [
        {
          _id: '_integrationId',
          name: 'mockIntegration',
          flowGroupings: [],
        }],
      flows: [
        {
          _id: '_flowId1',
          name: 'mockFlow1',
          _integrationId: addFlow ? '_integrationId' : 'none',
        },
        {
          _id: '_flowId2',
          name: 'mockFlow2',
          _integrationId: addFlow ? '_integrationId' : 'none',
        },
      ],
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: isEdit ? 'flowgroups/edit' : 'flowgroups/add'}]}>
      <FlowgroupDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: ({children}) => children,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    replace: mockHistoryReplace,
    location: {pathname: mockState},
  }),
}));
describe('FlowgroupDrawer tests', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case types.INTEGRATION.FLOW_GROUPS.CREATE_OR_UPDATE:
          mutateStore(initialStore, draft => {
            draft.session.asyncTask = {
              'flow-flowgroup': {status: 'complete'},
            };
          });
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockHistoryGoBack.mockClear();
    mockHistoryReplace.mockClear();
  });
  test('Should able to test the FlowGroup drawer is there when create flowgroup without flows in integration', async () => {
    await initFlowgroupDrawer({props});
    expect(screen.getByText(/Create flow group/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Flows')).toBeInTheDocument();
    expect(screen.getByText('Add flows')).toBeInTheDocument();
    expect(screen.getByText(/No options/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const closeIcon = buttons.find(btn => btn.getAttribute('data-test') === 'closeRightDrawer');
    const closeButton = buttons.find(btn => btn.getAttribute('data-test') === 'cancel');
    const saveButton = buttons.find(btn => btn.getAttribute('data-test') === 'save');

    expect(closeIcon).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    await userEvent.click(buttons[1]);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(saveButton).not.toBeEnabled();
    await userEvent.click(closeButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });

  test('Should able to test the FlowGroup drawer with create flowgroup having flows with close after save', async () => {
    await initFlowgroupDrawer({props, isEdit: false, addFlow: true});
    expect(screen.getByText(/Create flow group/i)).toBeInTheDocument();
    const checkbox = await waitFor(() => screen.getAllByRole('checkbox')[0]);

    await userEvent.click(checkbox);
    const nameInput = document.querySelector('input');

    await userEvent.click(nameInput);
    await userEvent.keyboard('Mock flowgroup');
    await userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
  test('Should able to test the FlowGroup drawer with create flowgroup having flows and move to edit drawer', async () => {
    await initFlowgroupDrawer({props, isEdit: false, addFlow: true});
    expect(screen.getByText(/Create flow group/i)).toBeInTheDocument();
    const checkbox = await waitFor(() => screen.getAllByRole('checkbox')[0]);

    await userEvent.click(checkbox);
    const nameInput = document.querySelector('input');

    await userEvent.click(nameInput);
    await userEvent.keyboard('Mock flowgroup');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockHistoryGoBack).not.toHaveBeenCalled();
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/_integrationId/flows/sections/undefined/flowgroups/edit');
  });
  test('Should able to test the FlowGroup drawer is there when Create flowgroup failed', async () => {
    await initFlowgroupDrawer({props}, 'Failed');
    expect(screen.getByText(/Create flow group/i)).toBeInTheDocument();
    expect(screen.getByText(/Flow group failed to save/i)).toBeInTheDocument();
  });
  test('Should able to test the FlowGroup drawer is there when Edit flowgroup with flows', async () => {
    mockState = '/edit';
    await initFlowgroupDrawer({props, isEdit: true, addFlow: true});
    expect(screen.getByText(/Edit flow group/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete flow group/i)).toBeInTheDocument();
    expect(screen.queryByText(/No options/i)).not.toBeInTheDocument();
    expect(screen.getByText(/mockFlow1/i)).toBeInTheDocument();
    expect(screen.getByText(/mockFlow2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Unassigned/i)).toHaveLength(2);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes).toHaveLength(2);
    await userEvent.click(checkboxes[0]);
    const nameInput = document.querySelector('input');

    await userEvent.click(nameInput);
    await userEvent.keyboard('mockFlowGroupName');
    mockDispatchFn.mockClear();
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.resource.integrations.flowGroups.createOrUpdate('_integrationId', '', 'flow-flowgroup'));
  });
});


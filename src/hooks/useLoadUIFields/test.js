import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import useLoadUIFields from '.';
import actions from '../../actions';
import * as panelUtils from '../../components/drawer/Resource/Panel';

const mockHistoryReplace = jest.fn();
const flowId = 'flow-123';
const resourceId = 'id-1';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
  useLocation: () => ({ pathname: '/' }),
}));

async function initUseLoadUIFields(flowId, resourceId, resourceType, uiFields = {}, flowStatus = {}) {
  const DummyComponent = () => {
    const loaded = useLoadUIFields({ flowId, resourceId, resourceType });

    if (loaded) {
      return 'children';
    }

    return null;
  };

  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.uiFields = {
      resourceMap: uiFields,
      flows: [{
        id: flowId,
        status: flowStatus.status,
        resources: flowStatus.resources || [],
      }],
    };
  });

  renderWithProviders(<MemoryRouter><DummyComponent /></MemoryRouter>, {initialStore});
}
describe('useLoadUIFields tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should not dispatch any action incase of invalid props', async () => {
    await initUseLoadUIFields();
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('children')).toBeInTheDocument();
  });
  test('should not dispatch any action incase of resources other than eligible ones', async () => {
    await initUseLoadUIFields(undefined, resourceId, 'scripts');
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('children')).toBeInTheDocument();
  });
  test('should not dispatch any action if the resource ui fields are already loaded', async () => {
    const uiFields = { [resourceId]: { mockOutput: {} } };

    await initUseLoadUIFields(undefined, resourceId, 'exports', uiFields);
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('children')).toBeInTheDocument();
  });
  test('should dispatch flow level ui fields action incase flowId is passed', async () => {
    await initUseLoadUIFields(flowId, resourceId, 'exports');
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.uiFields.requestFlowLevel(flowId));
    expect(screen.queryByText('children')).not.toBeInTheDocument();
  });
  test('should dispatch resource level ui fields action when there is no flow id and the resource ui fields are not yet loaded', async () => {
    await initUseLoadUIFields(undefined, resourceId, 'exports');
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.request('exports', resourceId));
    expect(screen.queryByText('children')).not.toBeInTheDocument();
  });
  test('should dispatch resource level ui fields action when there is flow id but it is a nested drawer, hence considered a resource level', async () => {
    jest.spyOn(panelUtils, 'isNestedDrawer').mockReturnValue(true);
    const flowStatus = {
      status: 'received',
      resources: [],
    };

    await initUseLoadUIFields(flowId, resourceId, 'exports', undefined, flowStatus);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.request('exports', resourceId));
    expect(screen.queryByText('children')).not.toBeInTheDocument();
  });
  test('should render children incase the resource is a new one', async () => {
    await initUseLoadUIFields(undefined, 'new-123', 'exports');
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('children')).toBeInTheDocument();
  });
  test('should not dispatch flow level ui fields action if they are already loaded', async () => {
    const flowStatus = {
      status: 'received',
      resources: [resourceId],
    };
    const uiFields = { [resourceId]: { mockOutput: {} } };

    await initUseLoadUIFields(flowId, resourceId, 'exports', uiFields, flowStatus);
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
    expect(screen.queryByText('children')).toBeInTheDocument();
  });
});


import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import MockInput from '.';
import { getCreatedStore } from '../../../store';
import { runServer } from '../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import actionTypes from '../../../actions/types';
import { MOCK_INPUT_STATUS } from '../../../constants';
import { DrawerProvider } from '../../drawer/Right/DrawerContext';
import actions from '../../../actions';
import { message } from '../../../utils/messageStore';

let initialStore;

const flowId = 'flowId';
const formKey = 'imports-98765';
const resourceId = '98765';
const defaultData = {
  Budget: 1,
  Director: 'director',
  ID: '1',
  Name: 'name',
  Producer: 'producer',
  NewObj: {
    ID: 'name',
  },
};

function initMockInput({ resourceType = 'imports', status, data, userData } = {}) {
  mutateStore(initialStore, draft => {
    draft.session.mockInput[resourceId] = {
      status,
      data,
      userData,
    };
  });
  const drawerProviderProps = {
    onClose: jest.fn(),
    height: 'short',
    fullPath: '/',
  };
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/654321/flowBuilder/12345/edit/imports/98765/inputData'}]}
    >
      <Route
        path="/integrations/654321/flowBuilder/12345/edit/imports/98765"
        url="/integrations/654321/flowBuilder/12345/edit/imports/98765"
      >
        <DrawerProvider {...drawerProviderProps}>
          <MockInput flowId={flowId} formKey={formKey} resourceType={resourceType} resourceId={resourceId} />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

jest.mock('../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right'),
  default: newProps => (
    <>
      <div>{newProps.children}</div>
      {/* eslint-disable-next-line react/button-has-type, react/button-has-type, react/jsx-handler-names */}
      <div><button onClick={newProps.onClose}>On Close</button></div>
    </>
  ),
}
));
jest.mock('../../AFE/Editor/panels/Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../AFE/Editor/panels/Code'),
  default: props => {
    let value;

    if (typeof props.value === 'string') {
      value = props.value;
    } else {
      value = JSON.stringify(props.value);
    }
    const handleChange = event => {
      props.onChange(event?.currentTarget?.value);
    };

    return (
      <>
        <textarea name="codeEditor" value={value} onChange={handleChange} />
      </>
    );
  },
}
));
describe('mock input drawer test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');

    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case actionTypes.MOCK_INPUT.RECEIVED:
        case actionTypes.MOCK_INPUT.RECEIVED_ERROR:
        case actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT:
        case actionTypes.MOCK_INPUT.CLEAR:
          initialStore.dispatch(action);
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should dispatch and update the state with correct user input on click of done button', async () => {
    initMockInput({ status: 'received', data: defaultData });
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();
    expect(screen.getByText(
      '{"page_of_records":[{"record":{"Budget":1,"Director":"director","ID":"1","Name":"name","Producer":"producer","NewObj":{"ID":"name"}}}]}'
    )).toBeInTheDocument();
    const doneButtonNode = screen.getByText(/Done/i);

    expect(doneButtonNode).toBeInTheDocument();
    await userEvent.click(doneButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT,
      resourceId: '98765',
      data: {Budget: 1, Director: 'director', ID: '1', Name: 'name', Producer: 'producer', NewObj: {ID: 'name'}},
    });
  });
  test('should navigate the history correctly on click of close button', async () => {
    initMockInput({ status: 'received', data: defaultData });
    const inputNode = screen.getByRole('textbox');
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();
    await userEvent.clear(inputNode);
    await userEvent.type(inputNode, '{}'.replace(/[{[]/g, '$&$&'));
    expect(screen.getByText(/Mock input must be in integrator.io canonical format./)).toBeInTheDocument();
    const onCloseButtonNode = screen.getByRole('button', {name: 'On Close'});

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/654321/flowBuilder/12345/edit/imports/98765');
  });
  test('should show error for invalid JSON input', async () => {
    initMockInput({ status: 'received', data: defaultData });
    const inputNode = document.querySelector('textarea[name="codeEditor"]');

    await userEvent.clear(inputNode);
    await userEvent.type(inputNode, 'userinput');
    expect(screen.getByText(/userinput/i)).toBeInTheDocument();
    expect(screen.getByText(message.MOCK_INPUT_REFRESH.INVALID_JSON)).toBeInTheDocument();
  });
  test('should wrap array data type correctly', async () => {
    initMockInput({ status: 'received', data: [{id: '123'}] });
    expect(screen.getByText('{"page_of_records":[{"rows":[{"id":"123"}]}]}')).toBeInTheDocument();
  });
  test('should fetch mock input data and update editor with mock input on initial load of the component', async () => {
    initMockInput();
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: actionTypes.MOCK_INPUT.REQUEST,
      resourceId,
      resourceType: 'imports',
      flowId,
      options: {refreshCache: undefined},
    });

    await initialStore.dispatch(actions.mockInput.received(resourceId, defaultData));

    await waitFor(() => {
      expect(screen.getByText('{"page_of_records":[{"record":{"Budget":1,"Director":"director","ID":"1","Name":"name","Producer":"producer","NewObj":{"ID":"name"}}}]}')).toBeInTheDocument();
    });
  });
  test('should update editor with mock input stub if fetchMockInput fails on initial load of the component', async () => {
    initMockInput();
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: actionTypes.MOCK_INPUT.REQUEST,
      resourceId,
      resourceType: 'imports',
      flowId,
      options: {refreshCache: undefined},
    });

    await initialStore.dispatch(actions.mockInput.receivedError(resourceId, 'Not found'));

    await waitFor(() => {
      expect(screen.getByText('{"page_of_records":[{"record":{}}]}')).toBeInTheDocument();
    });
  });
  test('should show a spinner and "Fetch latest input data" button should be disabled when mock input is requested', async () => {
    initMockInput({ status: MOCK_INPUT_STATUS.REQUESTED });
    const spinnerNode = screen.getByRole('progressbar');

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress-'));

    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeDisabled();
  });
  test('should dispatch correct action on click of "Fetch latest input data" button and show success snackbar', async () => {
    initMockInput({ status: 'status' });
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();

    await userEvent.click(fetchLatestInputButton);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: actionTypes.MOCK_INPUT.REQUEST,
      resourceId,
      resourceType: 'imports',
      flowId,
      options: {refreshCache: true},
    });

    // mocking saga dispatch
    await initialStore.dispatch(actions.mockInput.received(resourceId, defaultData));

    await waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT,
        resourceId,
      });
      expect(screen.getByText(message.MOCK_INPUT_REFRESH.SUCCESS)).toBeInTheDocument();
    });
  });
  test('should dispatch correct action on click of "Fetch latest input data" button and show error snackbar', async () => {
    initMockInput({ status: 'status' });
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();

    await userEvent.click(fetchLatestInputButton);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: actionTypes.MOCK_INPUT.REQUEST,
      resourceId,
      resourceType: 'imports',
      flowId,
      options: {refreshCache: true},
    });

    // mocking saga dispatch
    await initialStore.dispatch(actions.mockInput.receivedError(resourceId, 'Not found'));

    await waitFor(() => {
      expect(screen.getByText(message.MOCK_INPUT_REFRESH.FAILED)).toBeInTheDocument();
    });
  });
});


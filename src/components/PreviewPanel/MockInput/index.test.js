/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-handler-names */
/* global describe, test, jest, beforeEach, afterEach, expect */
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import MockInput from '.';
import { getCreatedStore } from '../../../store';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';
import actionTypes from '../../../actions/types';
import { MOCK_INPUT_STATUS } from '../../../constants';
import { DrawerProvider } from '../../drawer/Right/DrawerContext';
import actions from '../../../actions';

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

async function initMockInput({ resourceType = 'imports', status, data, userData } = {}) {
  initialStore.getState().session.mockInput[resourceId] = {
    status,
    data,
    userData,
  };
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
describe('Mock input drawer test cases', () => {
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
    await initMockInput({ status: 'received', data: defaultData });
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();
    expect(screen.getByText(
      '{"page_of_records":[{"record":{"Budget":1,"Director":"director","ID":"1","Name":"name","Producer":"producer","NewObj":{"ID":"name"}}}]}'
    )).toBeInTheDocument();
    const doneButtonNode = screen.getByText(/Done/i);

    expect(doneButtonNode).toBeInTheDocument();
    userEvent.click(doneButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT,
      resourceId: '98765',
      data: {Budget: 1, Director: 'director', ID: '1', Name: 'name', Producer: 'producer', NewObj: {ID: 'name'}},
    });
  });
  test('should navigate the history correctly on click of close button', async () => {
    await initMockInput({ status: 'received', data: defaultData });
    const inputNode = screen.getByRole('textbox');
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();
    userEvent.clear(inputNode);
    userEvent.type(inputNode, '{}'.replace(/[{[]/g, '$&$&'));
    expect(screen.getByText(/Mock input must contain page_of_records/)).toBeInTheDocument();
    const onCloseButtonNode = screen.getByRole('button', {name: 'On Close'});

    expect(onCloseButtonNode).toBeInTheDocument();
    userEvent.click(onCloseButtonNode);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/654321/flowBuilder/12345/edit/imports/98765');
  });
  test('should show error for invalid JSON input', async () => {
    await initMockInput({ status: 'received', data: defaultData });
    const inputNode = document.querySelector('textarea[name="codeEditor"]');

    userEvent.clear(inputNode);
    userEvent.type(inputNode, 'userinput');
    expect(screen.getByText(/userinput/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock input must be valid JSON/i)).toBeInTheDocument();
  });
  test('should wrap array data type correctly', async () => {
    await initMockInput({ status: 'received', data: [{id: '123'}] });
    expect(screen.getByText('{"page_of_records":[{"rows":[{"id":"123"}]}]}')).toBeInTheDocument();
  });
  test('should show a spinner and "Fetch latest input data" button should be disabled when mock input is requested', async () => {
    await initMockInput({ status: MOCK_INPUT_STATUS.REQUESTED });
    expect(document.querySelector(['svg[class="MuiCircularProgress-svg"]'])).toBeInTheDocument();

    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeDisabled();
  });
  test('should dispatch correct action on click of "Fetch latest input data" button and show success snackbar', async () => {
    await initMockInput({ status: 'status' });
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();

    userEvent.click(fetchLatestInputButton);
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
      expect(screen.getByText(/Successfully fetched latest input data./i)).toBeInTheDocument();
    });
  });
  test('should dispatch correct action on click of "Fetch latest input data" button and show error snackbar', async () => {
    await initMockInput({ status: 'status' });
    expect(screen.getByText(/Edit mock input/i)).toBeInTheDocument();
    const fetchLatestInputButton = document.querySelector("[data-test='fetchLatestInputData']");

    expect(fetchLatestInputButton).toBeInTheDocument();

    userEvent.click(fetchLatestInputButton);
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
      expect(screen.getByText(/Failed to fetch latest input data./i)).toBeInTheDocument();
    });
  });
});


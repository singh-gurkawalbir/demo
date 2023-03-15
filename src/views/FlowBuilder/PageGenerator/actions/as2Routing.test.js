
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';
import { runServer} from '../../../../test/api/server';
import as2Routing from './as2Routing';

const initialStore = reduxStore;

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

jest.mock('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm'),
  default: props => {
    function onRemount() { props.remountAfterSaveFn(); }

    return (
      <>
        <button type="button" onClick={props.onSave}>Save</button>
        <button type="button" onClick={props.onClose}>Close</button>
        <button type="button" onClick={onRemount}>RemountAfterSaveButton</button>
      </>
    );
  },
}));

jest.mock('../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

jest.mock('../../../../components/DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm'),
  default: props => (
    <div>
      {props.formKey}
    </div>
  ),
}));

const as2resource = {
  _id: '62f366470260bf5b28b555ea',
  name: 'second',
  _connectionId: '62f24d45f8b63672312cd561',
  type: 'webhook',
  adaptorType: 'AS2Export',
};

const resource = {_connectionId: '5e7068331c056a75e6df19b2'};

describe('ExportHooks UI tests', () => {
  runServer();
  let mockDispatch;
  let useDispatchSpy;

  function mockingCompleteDispatch() {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatch = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatch);
  }
  function mockingDispatchExpectFormInit() {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatch = jest.fn(action => {
      switch (action.type) {
        case 'FORM_INIT':
          initialStore.dispatch(action); break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatch);
  }
  afterEach(() => {
    jest.resetAllMocks();
  });
  test('should test name, position and helpKey', () => {
    const {helpKey, name, position} = as2Routing;

    expect(name).toBe('as2Routing');
    expect(position).toBe('left');
    expect(helpKey).toBe('fb.pg.exports.as2routing');
  });
  test('should test as2Routing component Close button', async () => {
    const {Component} = as2Routing;
    const onClose = jest.fn();

    renderWithProviders(
      <Component
        resource={resource}
        open
        isViewMode={false}
        onClose={onClose}
    />);

    expect(screen.getByText('AS2 connection routing rules')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });
  test('should click on submit button', async () => {
    mockingCompleteDispatch();
    const {Component} = as2Routing;
    const onClose = jest.fn();

    mutateStore(initialStore, draft => {
      draft.session.form.as2Routing = {value: {contentBasedFlowRouter: {_scriptId: 'someScriptId', function: 'someFunction'}}};
    });

    renderWithProviders(
      <Component
        resource={as2resource}
        open
        isViewMode={false}
        onClose={onClose}
    />, {initialStore});

    expect(screen.getByText('AS2 connection routing rules')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_PATCH',
        resourceType: 'connections',
        id: '62f24d45f8b63672312cd561',
        patchSet: [
          {
            op: 'replace',
            path: '/as2/contentBasedFlowRouter/_scriptId',
            value: 'someScriptId',
          },
          {
            op: 'replace',
            path: '/as2/contentBasedFlowRouter/function',
            value: 'someFunction',
          },
        ],
        asyncKey: 'as2Routing',
      }
    );
  });
  test('should text onRemount button', async () => {
    mockingDispatchExpectFormInit();
    const {Component} = as2Routing;
    const onClose = jest.fn();

    initialStore.dispatch(actions.resource.requestCollection('connections'));
    await waitFor(() => expect(initialStore?.getState()?.data?.resources?.connections).toBeDefined());

    const {store} = renderWithProviders(
      <Component
        resource={as2resource}
        open
        isViewMode={false}
        onClose={onClose}
    />, {initialStore});

    expect(store?.getState()?.session.form.as2Routing.remountKey).toBe(0);

    await userEvent.click(screen.getByText('RemountAfterSaveButton'));
    expect(store?.getState()?.session.form.as2Routing.remountKey).toBe(1);
  });
});

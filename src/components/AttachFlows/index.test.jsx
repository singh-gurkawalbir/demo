import React from 'react';
import {screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { act } from 'react-dom/test-utils';
import actions from '../../actions';
import AttachFlows from './index';
import { runServer } from '../../test/api/server';
import { reduxStore, renderWithProviders } from '../../test/test-utils';

let initialStore;
const mockDispatch = jest.fn(actions => {
  switch (actions.type) {
    default: initialStore.dispatch(actions);
  }
});

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

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: ({children}) => <>{children}</>,
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
describe('attach Flows', () => {
  runServer();
  beforeEach(() => { initialStore = reduxStore; });
  afterEach(() => { mockDispatch.mockClear(); jest.resetAllMocks(); cleanup(); });

  test('should able to test the Attach flows modal dialog box attach button', async done => {
    const {store} = renderWithProviders(<MemoryRouter><AttachFlows integrationId="6248835cd68e2457e3b105ff" flowGroupingId="62a5b17bd92aff47b2eba399" /></MemoryRouter>, {initialStore});

    act(() => { store.dispatch(actions.resource.requestCollection('connections')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    act(() => { store.dispatch(actions.resource.requestCollection('integrations')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    act(() => { store.dispatch(actions.resource.requestCollection('flows')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
    act(() => { store.dispatch(actions.resource.requestCollection('exports')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());
    const Message = screen.getAllByRole('checkbox');

    fireEvent.click(Message[0]);
    const Message3 = screen.getByText('Select all flows');

    expect(Message3).toBeInTheDocument();
    const Message4 = screen.getByText('Attach');

    expect(Message4).toBeInTheDocument();
    fireEvent.click(Message4);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
      resourceType: 'flows',
      id: '629db47eccb94d35de6f1889',
      patch: [
        {
          op: 'replace',
          path: '/_integrationId',
          value: '6248835cd68e2457e3b105ff',
        },
        {
          op: 'add',
          path: '/_flowGroupingId',
          value: '62a5b17bd92aff47b2eba399',
        },
      ],
      options: undefined,
      context: undefined,
      parentContext: undefined,
      asyncKey: undefined,
    });
    done();
  });
  test('should able to test the Attach flows modal dialog box cancel button', async () => {
    const {store} = renderWithProviders(<MemoryRouter><AttachFlows integrationId="6248835cd68e2457e3b105ff" flowGroupingId="62a5b17bd92aff47b2eba399" /></MemoryRouter>, {initialStore});

    act(() => { store.dispatch(actions.resource.requestCollection('connections')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    act(() => { store.dispatch(actions.resource.requestCollection('integrations')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    act(() => { store.dispatch(actions.resource.requestCollection('flows')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
    act(() => { store.dispatch(actions.resource.requestCollection('exports')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());
    const Message4 = screen.getByText('Cancel');

    expect(Message4).toBeInTheDocument();
    fireEvent.click(Message4);
  });
  test('should able to test the Attach flows Modal dialog box with no flows', () => {
    renderWithProviders(<MemoryRouter><AttachFlows integrationId="6248835cd68e2457e3b105ff" flowGroupingId="62a5b17bd92aff47b2eba399" /></MemoryRouter>);
    const Message5 = screen.getByText('No flows found');

    expect(Message5).toBeInTheDocument();
  });
});

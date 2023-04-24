
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import Panel, {isNestedDrawer} from '.';
import actions from '../../../../actions';
import customCloneDeep from '../../../../utils/customCloneDeep';

const mockHistoryReplace = jest.fn();
const mockClose = jest.fn();
const props = { flowId: '_flowId', onClose: mockClose, occupyFullWidth: true, integrationId: '_integrationId'};

async function initPanel(props = {}, initFailed = false, resourceType = 'exports', _id = '_resourceId', operation = 'add') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [{ _id, _connectionId: '_connectionId', http: { relativeURI: ['/'], method: ['POST'], body: [], formType: 'http' }, adaptorType: 'HTTPImport' }],
      exports: [
        {
          _id: '_exportId',
          _connectionId: '_connectionId',
          http: {
            relativeURI: ['/'],
            method: ['GET'],
            body: [],
            formType: 'http',
          },
          adaptorType: 'HTTPExport',
        },
        {
          _id,
          _connectionId: '_connectionId',
          type: 'test',
          adaptorType: 'NetSuiteExport',
        },
      ],
      connections: [
        { _id: '_connectionId',
          type: 'http',
          http: {
            formType: 'http',
            baseURI: '/mockURI',
            mediaType: 'json',
          },
        },
      ],
    };
    draft.session.resourceForm = {
      'exports-_resourceId': {
        initFailed,
      },
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{ pathname: `/parentURL/${operation}/${resourceType}/${_id}` }]}>
      <Route path="/parentURL/:operation/:resourceType/:id">
        <Panel {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: ({children}) => children,
}));
jest.mock('../../../LoadUIFields', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadUIFields'),
  default: ({children}) => children,
}));
jest.mock('../../Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../Right/DrawerHeader'),
  default: ({children}) => children,
}));
jest.mock('../../../ResourceFormWithStatusPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ResourceFormWithStatusPanel'),
  default: props => (
    <>
      <button onClick={props.onSubmitComplete} type="button">Submit</button>
      {props.showNotificationToaster && (<p>Snackbar</p>)}
      <button onClick={props.onCloseNotificationToaster} type="button">Close notification</button>
    </>
  ),
}));
jest.mock('./ResourceFormActionsPanel', () => ({
  __esModule: true,
  ...jest.requireActual('./ResourceFormActionsPanel'),
  default: props =>
    (
      <button onClick={props.onCancel} type="button">{props.submitButtonLabel}
      </button>
    )
  ,
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
describe('Panel tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockHistoryReplace.mockClear();
  });
  test('Should able to test the Panel initial render with form init Failed and non full width', async () => {
    await initPanel({...props, occupyFullWidth: false}, true);
    expect(mockHistoryReplace).toHaveBeenCalledWith('/parentURL');
  });
  test('Should able to test the Panel with eventreports', async () => {
    await initPanel(props, false, 'eventreports', '_eventId', 'edit');
    expect(screen.getByRole('button', { name: 'Run report' })).toBeInTheDocument();
  });
  test('Should able to test the Panel with new connections', async () => {
    await initPanel(props, false, 'connections', 'new_connectionId');
    expect(screen.queryByText('Preview data')).not.toBeInTheDocument();
  });
  test('Should able to test the Panel with new pageProcessor', async () => {
    await initPanel(props, false, 'pageProcessor', 'new_pageProcessor');
    expect(screen.queryByText('Preview data')).not.toBeInTheDocument();
  });
  test('Should able to test the Panel with new pageGenerator', async () => {
    await initPanel(props, false, 'pageGenerator', 'new_pageGeneratorId');
    expect(screen.queryByText('Preview data')).not.toBeInTheDocument();
  });
  test('Should able to test the Panel initial render in full width', async () => {
    await initPanel(props);
    expect(screen.getByRole('img', { name: 'NetSuiteExport' })).toBeInTheDocument();
    expect(screen.getByText('Preview data')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', {name: 'Next'}));
    expect(mockClose).toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.submitAborted('exports', '_resourceId'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.clearStaged('_resourceId'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceFormSampleData.updateType('_resourceId', 'preview'));
    userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/parentURL/edit/exports/_resourceId');
    expect(isNestedDrawer('/add/pageGenerator/_id')).toBe(false);
    userEvent.click(screen.getByRole('button', {name: 'Close notification'}));
    expect(screen.queryByText('Snackbar')).not.toBeInTheDocument();
  });
});

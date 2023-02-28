import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import ManageLookup from './ManageLookup';
import { mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import profile from '../../../../reducers/user/profile';

const initialStore = getCreatedStore();

function initManageLookup(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {filecsv: {
      fieldId: 'file.csv',
      layout: 'compact',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      editorType: props.type,
      hidePreview: true,
    },
    filecv1: {
      timestamp: '2022-09-21T06:40:58.525Z',
    },
    };

    draft.data.resources = {
      imports: [{
        _id: '5b3c75dd5d3c125c88b5dd20',
        name: 'test import',
        adaptorType: 'HTTPImport',
        _connectionId: '6b3c75dd5d3c125c88b5dd20',
      }],
      connections: [{
        _id: '6a3c75dd5d3c125c88b5dd20',
        name: 'test connection',
      }],
    };

    draft.user[profile] = {
      timezone: 'Asia/Calcutta',
    };

    draft.session.form = {'imports-5b3c75dd5d3c125c88b5dd20': {
      fields: {
        id: '/http/lookups',
        value: [{id: 'id', name: 'test', value: 'test value'}],
      }
      ,
    }};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: '/imports/edit/imports/63877bbd52bb056425fe6255/editor/httprelativeURI/lookup/add'}]}>
      <Route path="/imports/edit/imports/63877bbd52bb056425fe6255/editor/httprelativeURI">
        <ManageLookup {...props} />
      </Route>
    </MemoryRouter>, {initialStore});
}

jest.mock('../../../DynaForm/useAutoScrollErrors', () => ({
  __esModule: true,
  ...jest.requireActual('../../../DynaForm/useAutoScrollErrors'),
  default: () => {},
}));

const mockOnClose = jest.fn();

jest.mock('../../../drawer/Right/DrawerContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../../drawer/Right/DrawerContext'),
  default: () => ({onClose: mockOnClose}),
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('manageLookup UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should pass the initial render', () => {
    initManageLookup({editorId: 'filecsv', formId: '/http/lookups'});
    expect(screen.getByText('Lookup type')).toBeInTheDocument();
    expect(screen.getByText('Dynamic search')).toBeInTheDocument();
    expect(screen.getByText('Static: value to value')).toBeInTheDocument();
    expect(screen.getByText('Relative URI')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('Resource identifier path')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Action to take if unique match not found')).toBeInTheDocument();
    expect(screen.getByText('Use empty string as default value')).toBeInTheDocument();
    expect(screen.getByText('Fail record')).toBeInTheDocument();
    expect(screen.getByText('Use null as default value')).toBeInTheDocument();
    expect(screen.getByText('Use custom default value')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    const textFields = screen.getAllByRole('textbox');

    expect(textFields).toHaveLength(3);
  });
  test('should make a url redirection when clicked on Create lookup button', async () => {
    initManageLookup({editorId: 'filecsv', formId: '/http/lookups'});
    const createButtons = screen.getAllByText('Create lookup');

    expect(createButtons[0]).toBeInTheDocument();
    await userEvent.click(createButtons[0]);
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/imports/edit/imports/63877bbd52bb056425fe6255/editor/httprelativeURI/lookup/add'));
  });
  test('should render empty DOM when showlookup and lookupFieldId are absent', () => {
    const {utils} = initManageLookup({editorId: 'filecsv2', formId: '/http/lookups'});

    expect(utils.container).toBeEmptyDOMElement();
  });
});

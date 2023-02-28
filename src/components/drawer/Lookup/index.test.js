
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import LookupDrawer from '.';

const mockHistoryGoBack = jest.fn();
const mockHistoryPush = jest.fn();
const manageLookupURL = '/parentURL/lookup';
const editLookupURL = '/parentURL/lookup/edit';
const createLookupURL = '/parentURL/lookup/add';
const mockSave = jest.fn();
const props = {
  lookups: [{allowFailures: false, name: 'lookupName', map: { expField: 'impField'}, useImportHeaders: true}],
  onSave: mockSave,
  options: [],
  disabled: false,
  flowId: '_flowId1',
  resourceId: '_importId',
  resourceType: 'imports',
};

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

async function initLookupDrawer(props = {}, pathname = manageLookupURL, renderFun) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.form = {
      LOOKUP_DRAWER_FORM_KEY: {
        disabled: false,
        isValid: true,
        fields: {_mode: {touched: true}},
        value: {
          _mode: 'dynamic',
          _relativeURI: '/',
          _method: 'GET',
          _extract: 'data[0].id',
          _failRecord: 'disallowFailure',
          _name: 'lookupName',
        },
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname}]}>
      <Route path="/parentURL">
        <LookupDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    push: mockHistoryPush,
  }),
}));

describe('LookupDrawer tests', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  afterEach(() => {
    mockHistoryGoBack.mockClear();
    mockHistoryPush.mockClear();
    mockSave.mockClear();
  });
  test('Should able to test the Lookup drawer with manage action', async () => {
    await initLookupDrawer(props);
    expect(screen.getByRole('heading', {name: 'Manage lookups'})).toBeInTheDocument();
    const closeIcon = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'closeRightDrawer');

    await userEvent.click(closeIcon);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    const createLookupBtn = screen.getByRole('button', {name: 'Create lookup'});

    expect(createLookupBtn).toBeInTheDocument();
    await userEvent.click(createLookupBtn);
    expect(mockHistoryPush).toHaveBeenCalledWith('/parentURL/lookup/add');
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('lookupName')).toBeInTheDocument();
    const closeButton = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'closeLookupListing');

    await userEvent.click(closeButton);
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(2);
    const actionBtn = screen.getByRole('button', {name: 'more'});

    await userEvent.click(actionBtn);
    const editLookupOption = screen.getByRole('menuitem', {name: 'Edit lookup'});
    const deleteLookupOption = screen.getByRole('menuitem', {name: 'Delete lookup'});

    expect(editLookupOption).toBeInTheDocument();
    expect(deleteLookupOption).toBeInTheDocument();
    mockHistoryPush.mockClear();
    await userEvent.click(editLookupOption);
    expect(mockHistoryPush).toHaveBeenCalledWith('/parentURL/lookup/edit');
    await userEvent.click(deleteLookupOption);
    expect(mockSave).toHaveBeenCalledWith([]);
  });
  test('Should able to test the Lookup drawer with Create action', async () => {
    await initLookupDrawer({...props, lookups: undefined}, createLookupURL);
    expect(screen.getByRole('heading', {name: 'Create lookup'})).toBeInTheDocument();
    const dynamicOption = screen.getByRole('radio', {name: 'Dynamic search'});

    expect(dynamicOption).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Static: value to value'})).toBeInTheDocument();
    expect(screen.getByText('Action to take if unique match not found')).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Fail record'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Use empty string as default value'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Use null as default value'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Use custom default value'})).toBeInTheDocument();

    await userEvent.click(dynamicOption);
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    await userEvent.click(screen.getByRole('menuitem', {name: 'GET'}));
    await userEvent.type(screen.getAllByRole('textbox')[1], 'data.0.id');
    await userEvent.type(screen.getAllByRole('textbox')[2], 'newLookup');
    await userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockSave).toHaveBeenCalledWith([{
      allowFailures: false,
      body: undefined,
      extract: 'data.0.id',
      method: 'GET',
      name: 'newLookup',
      postBody: undefined,
      query: undefined,
      relativeURI: undefined }]);
  });

  test('Should able to test the Lookup drawer with Create action with duplicate lookup name', async () => {
    await initLookupDrawer({...props, lookups: [{name: ''}, {name: 'lookup1', map: {exp: 'imp'}}]}, createLookupURL);

    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    await userEvent.click(screen.getByRole('menuitem', {name: 'GET'}));
    await userEvent.type(screen.getAllByRole('textbox')[0], '/persons');
    await userEvent.type(screen.getAllByRole('textbox')[1], 'data.0.name');
    await userEvent.type(screen.getAllByRole('textbox')[2], 'lookup1');
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(screen.getByRole('heading', {name: 'Lookup with same name is already present!'})).toBeInTheDocument();
  });
  test('Should able to test the Lookup drawer with Edit action and lookup type dynamic', async () => {
    const lookupObj = {
      allowFailures: false,
      body: undefined,
      extract: 'data[0].id',
      method: 'GET',
      name: 'fads',
      postBody: undefined,
      query: undefined,
      relativeURI: '/' };

    await initLookupDrawer({...props, lookups: [lookupObj]}, editLookupURL);
    expect(screen.getByRole('heading', {name: 'Edit lookup'})).toBeInTheDocument();
    await userEvent.clear(screen.getAllByRole('textbox')[0]);
    await userEvent.keyboard('/users.json');
    await userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockSave).toHaveBeenCalledWith([{...lookupObj, relativeURI: '/users.json'}]);
  });
});


/* global describe, test, expect, afterEach, jest */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
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

async function initLookupDrawer(props = {}, pathname = manageLookupURL, renderFun) {
  const initialStore = reduxStore;

  initialStore.getState().session.form = {
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

    userEvent.click(closeIcon);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    const createLookupBtn = screen.getByRole('button', {name: 'Create lookup'});

    expect(createLookupBtn).toBeInTheDocument();
    userEvent.click(createLookupBtn);
    expect(mockHistoryPush).toHaveBeenCalledWith('/parentURL/lookup/add');
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('lookupName')).toBeInTheDocument();
    const closeButton = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'closeLookupListing');

    userEvent.click(closeButton);
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(2);
    const actionBtn = screen.getByRole('button', {name: 'more'});

    userEvent.click(actionBtn);
    const editLookupOption = screen.getByRole('menuitem', {name: 'Edit lookup'});
    const deleteLookupOption = screen.getByRole('menuitem', {name: 'Delete lookup'});

    expect(editLookupOption).toBeInTheDocument();
    expect(deleteLookupOption).toBeInTheDocument();
    mockHistoryPush.mockClear();
    userEvent.click(editLookupOption);
    expect(mockHistoryPush).toHaveBeenCalledWith('/parentURL/lookup/edit');
    userEvent.click(deleteLookupOption);
    expect(mockSave).toHaveBeenCalledWith([]);
  });
  test('Should able to test the Lookup drawer with Create action', async () => {
    await initLookupDrawer({...props, lookups: undefined}, createLookupURL);
    expect(screen.getByRole('heading', {name: 'Create lookup'})).toBeInTheDocument();
    const backButton = screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'backRightDrawer');
    const dynamicOption = screen.getByRole('radio', {name: 'Dynamic search'});

    userEvent.click(backButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    expect(dynamicOption).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Static: value to value'})).toBeInTheDocument();
    expect(screen.getByText('Action to take if unique match not found')).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Fail record'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Use empty string as default value'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Use null as default value'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Use custom default value'})).toBeInTheDocument();

    userEvent.click(dynamicOption);
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    userEvent.click(screen.getByRole('menuitem', {name: 'GET'}));
    userEvent.type(screen.getAllByRole('textbox')[1], 'data.0.id');
    userEvent.type(screen.getAllByRole('textbox')[2], 'newLookup');
    userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
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

    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    userEvent.click(screen.getByRole('menuitem', {name: 'GET'}));
    userEvent.type(screen.getAllByRole('textbox')[0], '/persons');
    userEvent.type(screen.getAllByRole('textbox')[1], 'data.0.name');
    userEvent.type(screen.getAllByRole('textbox')[2], 'lookup1');
    userEvent.click(screen.getByRole('button', {name: 'Save'}));
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
    userEvent.clear(screen.getAllByRole('textbox')[0]);
    userEvent.keyboard('/users.json');
    userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockSave).toHaveBeenCalledWith([{...lookupObj, relativeURI: '/users.json'}]);
  });
});


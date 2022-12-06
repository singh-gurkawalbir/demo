/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import CreateAliasDrawer from './CreateAliases';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';

const props = {
  resourceId: '_integrationId',
  resourceType: 'integrations',
};
let mockState = '/';
const mockHistoryGoBack = jest.fn();
const mockHistoryReplace = jest.fn();

async function initCreateAliasDrawer({props = {}, isEdit = true}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    integrations: [
      {
        _id: '_integrationId',
        name: 'mockIntegration',
        _registeredConnectionIds: ['_connId'],
        aliases: [{alias: '_aliasId', _connectionId: '_connId', description: 'some description'}],
      },
    ],
    connections: [{
      _id: '_connId',
      name: 'RegisteredConnection',
    }],
  };
  const ui = (
    <MemoryRouter initialEntries={[{pathname: isEdit ? 'edit/_aliasId' : 'add'}]}>
      <CreateAliasDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    replace: mockHistoryReplace,
    location: {pathname: mockState},
  }),
}));

describe('CreateAliasDrawer tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = cloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case actionTypes.RESOURCE.CREATE_OR_UPDATE_ALIAS:
          initialStore.getState().session.aliases._integrationId = {
            aliasId: action.isEdit ? action.aliasId : 'new-alias-id',
            status: action.isEdit ? 'edit' : 'save',
          };
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
  test('Should able to test the alias drawer with create alias', async () => {
    await initCreateAliasDrawer({props, isEdit: false});
    expect(screen.getByRole('heading', {name: 'Create alias'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Aliases guide'})).toBeInTheDocument();
    expect(screen.getByText('Alias description')).toBeInTheDocument();
    expect(screen.getByText('Resource type')).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const pageInfo = buttons.find(b => b.getAttribute('data-test') === 'openPageInfo');
    const closeIcon = buttons.find(b => b.getAttribute('data-test') === 'closeRightDrawer');
    const saveBtn = buttons.find(b => b.getAttribute('data-test') === 'save');
    const closeBtn = buttons.find(b => b.getAttribute('data-test') === 'cancel');

    expect(closeIcon).toBeEnabled();
    expect(closeBtn).toBeEnabled();
    expect(saveBtn).not.toBeEnabled();

    userEvent.click(pageInfo);
    expect(screen.getByRole('tooltip', {name: 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. You can create aliases for flows, connections, imports, and exports.'})).toBeInTheDocument();
    userEvent.click(closeBtn);
    expect(mockHistoryGoBack).toHaveBeenCalled();

    // creating alias
    userEvent.click(screen.getAllByRole('textbox')[0]);
    userEvent.keyboard('new-alias-id');
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    userEvent.click(screen.getByRole('menuitem', {name: 'Connection'}));
    expect(screen.queryByText('Resource name')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    userEvent.click(screen.getByRole('menuitem', {name: 'RegisteredConnection'}));
    mockDispatchFn.mockClear();
    userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.resource.aliases.createOrUpdate('_integrationId', 'integrations', undefined, false, 'integration-alias'));
    expect(mockHistoryReplace).toHaveBeenCalledWith('//edit/new-alias-id');
  });
  test('Should able to test the alias drawer with edit alias', async () => {
    mockState = '/edit';
    await initCreateAliasDrawer({props});
    expect(screen.getByRole('heading', {name: 'Edit alias'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Aliases guide'})).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const pageInfo = buttons.find(b => b.getAttribute('data-test') === 'openPageInfo');

    userEvent.click(pageInfo);
    expect(screen.getByRole('tooltip', {name: 'Editing an alias is helpful when you\'ve built an improved flow or other resource and want all of the scripts that reference the alias to use the new resource. You can update any of the fields for an alias as needed, but keep in mind this may have implications on any scripts that currently reference the alias. CAUTION: *If you change the Alias ID (name), it is not updated in existing scripts. *Only change the type and select a new resource matching that type only if you\'re certain this will not adversely impact any existing scripts that reference the alias. Learn more about aliases .'})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Learn more about aliases'})).toBeInTheDocument();
    // editing alias description
    userEvent.click(screen.getAllByRole('textbox')[1]);
    userEvent.keyboard('added');
    userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(mockHistoryReplace).not.toHaveBeenCalled();
  });
});


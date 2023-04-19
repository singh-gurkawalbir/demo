/* eslint-disable jest/no-conditional-in-test */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactredux from 'react-redux';
import { createMemoryHistory } from 'history';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import { runServer } from '../../../../../test/api/server';
import actions from '../../../../../actions';
import SettingsForm from '.';
import * as utils from '../../../../../utils/resource';

const customSettings = {
  status: 'received',
  meta: {
    fieldMap: {
      selectApp_offboard: {
        id: 'selectApp_offboard',
        name: 'selectApp',
        type: 'select',
        label: 'Add application',
        required: false,
        options: [
          {
            items: [
              {
                label: 'Option1',
                value: 'value1',
              },
              {
                label: 'Option2',
                value: 'value2',
              },
            ],
          },
        ],
      },
    },
    layout: {
      fields: [
        'selectApp_offboard',
      ],
    },
  },
  scriptId: '61dedf725c907e4eac13af00',
  key: '5Q4TVRz7q',
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

describe('SettingsForm UI tests', () => {
  runServer();
  beforeEach(() => {
    jest.resetAllMocks();
  });
  async function addInteration(initialStore) {
    initialStore.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(initialStore?.getState()?.data?.resources?.integrations).toBeDefined());
  }

  async function initStoreAndRender(integrationId, pathname) {
    const initialStore = getCreatedStore();
    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    mutateStore(initialStore, draft => {
      draft.user.preferences = {defaultAShareId: 'own'};
    });

    await addInteration(initialStore);

    mutateStore(initialStore, draft => {
      draft.session.customSettings['61dedf725c907e4eac13af03'] = customSettings;
      draft.session.customSettings['61dedf725c907e4eac13af04'] = customSettings;
    });

    const { utils } = renderWithProviders(
      <MemoryRouter initialEntries={[{pathname}]}>
        <Route path="/:sectionId">
          <SettingsForm integrationId={integrationId} />
        </Route>
      </MemoryRouter>,
      {initialStore});

    return {utils, mockDispatch};
  }

  test('should test when no parameter is provided', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter>
        <Route>
          <SettingsForm />
        </Route>
      </MemoryRouter>);

    expect(utils.container.textContent).toBe('SettingsSave');
  });
  test('should test the case when integration has no flow groupings', async () => {
    const {utils} = await initStoreAndRender('5ff579d745ceef7dcd797c15', '/someID');

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(utils.container.textContent).toBe('SettingsSave');
  });

  test('should test dispatch call when clicked on Save', async () => {
    const {mockDispatch} = await initStoreAndRender('61dedf725c907e4eac13af03', '/61b9d5803deb5437e2dfaadd');

    await userEvent.click(screen.getByText('Deprovisioning'));
    await userEvent.click(screen.getByText('Please select'));
    await userEvent.click(screen.getByText('Option1'));

    await userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_PATCH',
        resourceType: 'integrations',
        id: '61dedf725c907e4eac13af03',
        patchSet: [
          {
            op: 'replace',
            path: '/flowGroupings/1/settings',
            value: { selectApp: 'value1' },
          },
        ],
        asyncKey: undefined,
      }
    );
  });
  test('should click on Save when isFrameWork2 is true', async () => {
    const {mockDispatch} = await initStoreAndRender('61dedf725c907e4eac13af04', '/61b9d5803deb5437e2dfaadd');

    await userEvent.click(screen.getByText('Deprovisioning'));
    await userEvent.click(screen.getByText('Please select'));
    await userEvent.click(screen.getByText('Option2'));

    await userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH_AND_COMMIT',
        resourceType: 'integrations',
        id: '61dedf725c907e4eac13af04',
        patch: [
          {
            op: 'replace',
            path: '/flowGroupings/1/settings',
            value: { selectApp: 'value2' },
          },
        ],
        options: { refetchResources: true },
        context: undefined,
        parentContext: undefined,
        asyncKey: undefined,
      }
    );
  });

  test('should test the case when invalid section id is provided through URL', async () => {
    const initialStore = getCreatedStore();

    const history = createMemoryHistory({ initialEntries: ['/wrongsectionId'] });

    history.replace = jest.fn();

    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);
    mutateStore(initialStore, draft => {
      draft.user.preferences = {defaultAShareId: 'own'};
    });

    await addInteration(initialStore);
    mutateStore(initialStore, draft => {
      draft.session.customSettings['61dedf725c907e4eac13af03'] = customSettings;
    });
    renderWithProviders(
      <Router history={history}>
        <Route path="/:sectionId">
          <SettingsForm integrationId="61dedf725c907e4eac13af03" />
        </Route>
      </Router>,
      {initialStore});
    expect(history.replace).toHaveBeenCalledWith('/general');
  });
  test('should test invalid case from validationHandler function', () => {
    jest.spyOn(utils, 'generateNewId').mockReturnValue('someId');

    const initialStore = getCreatedStore();
    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    const {store} = renderWithProviders(
      <MemoryRouter initialEntries={['/61b9d5803deb5437e2dfaadd']}>
        <Route path="/:sectionId">
          <SettingsForm integrationId="61dedf725c907e4eac13af03" />
        </Route>
      </MemoryRouter>,
      {initialStore}
    );

    const message = store.getState().session.form.someId.validationHandler({id: 'settings', value: {__invalid: true}});

    expect(message).toBe('Sub-form invalid.');
  });
  test('should test when non json value is passed in validationHandler function', () => {
    jest.spyOn(utils, 'generateNewId').mockReturnValue('someId');

    const initialStore = getCreatedStore();
    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    const {store} = renderWithProviders(
      <MemoryRouter initialEntries={['/61b9d5803deb5437e2dfaadd']}>
        <Route path="/:sectionId">
          <SettingsForm integrationId="61dedf725c907e4eac13af03" />
        </Route>
      </MemoryRouter>,
      {initialStore}
    );

    const message = store.getState().session.form.someId.validationHandler({id: 'settings', value: 'someValue'});

    expect(message).toBe('Settings must be valid JSON');
  });
});

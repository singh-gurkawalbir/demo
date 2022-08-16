/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactredux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import { renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import SettingsForm from '.';
import * as utils from '../../../../../utils/resource';

const integrations = [
  {
    _id: '5ff579d745ceef7dcd797c15',
    lastModified: '2021-01-19T06:34:17.222Z',
    name: " AFE 2.0 refactoring for DB's",
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '5cd51efd3607fe7d8eda9c97',
      '5ff57a8345ceef7dcd797c21',
    ],
    installSteps: [],
    uninstallSteps: [],
    createdAt: '2021-01-06T08:50:31.935Z',
  },
  {
    _id: '61dedf725c907e4eac13af03',
    lastModified: '2022-01-12T17:27:49.551Z',
    name: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    description: 'For companies using SAP SuccessFactors as the central hub, this Business Process Automation provides a seamless onboarding and offboarding employee experience to multiple applications like Microsoft Azure AD, Okta, SAP Concur, and ServiceNow.',
    install: [],
    mode: 'settings',
    version: '1.0.0',
    tag: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    sandbox: false,
    _templateId: '61b9d5d2f1447d5e7f8e0c6f',
    preSave: {
      function: 'processHire2RetireSAPSFSettingSave',
      _scriptId: '61dedf725c907e4eac13af00',
    },
    uninstallSteps: [],
    flowGroupings: [
      {
        name: 'Provisioning',
        _id: '61b9d5803deb5437e2dfaadc',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initProvisionSettings',
          },
        },
      },
      {
        name: 'Deprovisioning',
        _id: '61b9d5803deb5437e2dfaadd',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initDeprovisionSettings',
          },
        },
      },
    ],
    createdAt: '2022-01-12T14:02:26.330Z',
  },
  {
    _id: '61dedf725c907e4eac13af04',
    lastModified: '2022-01-12T17:27:49.551Z',
    name: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    description: 'SomeDescription',
    install: [],
    installSteps: ['2'],
    mode: 'settings',
    version: '1.0.0',
    tag: 'Clone - Employee Onboarding and Offboarding for SAP SuccessFactors@new',
    sandbox: false,
    _templateId: '61b9d5d2f1447d5e7f8e0c6f',
    preSave: {
      function: 'processHire2RetireSAPSFSettingSave',
      _scriptId: '61dedf725c907e4eac13af00',
    },
    uninstallSteps: [],
    flowGroupings: [
      {
        name: 'Provisioning',
        _id: '61b9d5803deb5437e2dfaadc',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initProvisionSettings',
          },
        },
      },
      {
        name: 'Deprovisioning',
        _id: '61b9d5803deb5437e2dfaadd',
        settingsForm: {
          init: {
            _scriptId: '61dedf725c907e4eac13af00',
            function: 'initDeprovisionSettings',
          },
        },
      },
    ],
    createdAt: '2022-01-12T14:02:26.330Z',
  },
];
const customSettings = {
  status: 'received',
  meta: {
    fieldMap: {
      selectApp_offboard: {
        id: 'selectApp_offboard',
        name: 'selectApp',
        type: 'select',
        helpText: 'Select one or many applications where SAP SuccessFactors can deprovision employee or user access using the Deprovision user access from SAP SuccessFactors flow. Examples: Azure AD, NetSuite, and Salesforce.',
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

describe('SettingsForm UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  function initStoreAndRender(integrationId, pathname) {
    const initialStore = getCreatedStore();
    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    initialStore.getState().user.preferences = {defaultAShareId: 'own'};
    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.customSettings['61dedf725c907e4eac13af03'] = customSettings;
    initialStore.getState().session.customSettings['61dedf725c907e4eac13af04'] = customSettings;

    const { utils } = renderWithProviders(
      <MemoryRouter initialEntries={[{pathname}]}>
        <Route path="/:sectionId">
          <SettingsForm integrationId={integrationId} />
        </Route>
      </MemoryRouter>,
      {initialStore});

    return {utils, mockDispatch};
  }

  test('should test when no paramter is provided', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter>
        <Route>
          <SettingsForm />
        </Route>
      </MemoryRouter>);

    expect(utils.container.textContent).toBe('SettingsSave');
  });
  test('should test the case when integration has no flow groupings', () => {
    const {utils} = initStoreAndRender('5ff579d745ceef7dcd797c15', '/someID');

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(utils.container.textContent).toBe('SettingsSave');
  });

  test('should test dispatch call when clicked on Save', () => {
    const {mockDispatch} = initStoreAndRender('61dedf725c907e4eac13af03', '/61b9d5803deb5437e2dfaadd');

    userEvent.click(screen.getByText('Deprovisioning'));
    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getByText('Option1'));

    userEvent.click(screen.getByText('Save'));
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
  test('should click on Save when isFrameWork2 is true', () => {
    const {mockDispatch} = initStoreAndRender('61dedf725c907e4eac13af04', '/61b9d5803deb5437e2dfaadd');

    userEvent.click(screen.getByText('Deprovisioning'));
    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getByText('Option2'));

    userEvent.click(screen.getByText('Save'));
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
        scope: 'value',
        options: { refetchResources: true },
        context: undefined,
        parentContext: undefined,
        asyncKey: undefined,
      }
    );
  });

  test('should test the case when invalid section id is provided through URL', () => {
    const initialStore = getCreatedStore();

    const history = createMemoryHistory({ initialEntries: ['/wrongsectionId'] });

    history.replace = jest.fn();

    const mockDispatch = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });

    jest.spyOn(reactredux, 'useDispatch').mockReturnValue(mockDispatch);

    initialStore.getState().user.preferences = {defaultAShareId: 'own'};

    initialStore.getState().data.resources.integrations = integrations;
    initialStore.getState().session.customSettings['61dedf725c907e4eac13af03'] = customSettings;
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
  test('should test when non json value is passes in validationHandler function', () => {
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

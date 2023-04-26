/* eslint-disable jest/expect-expect */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import FormStepDrawer from '../index';
import {formProps} from './fileprops';
import {getCreatedStore} from '../../../../store';

function initFormDrawer(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '62beb29aa0f5f2144816f80c',
      lastModified: '2022-07-01T08:39:31.036Z',
      name: 'Data Warehouse Automation for Snowflake',
      install: [],
      mode: 'install',
      version: '1.0.0',
      sandbox: false,
      _registeredConnectionIds: [
        '62beb2c2a0f5f2144816f818',
      ],
      _templateId: '611f3bc1e3488c6cb37b8bc0',
      settingsForm: {
        form: {
          layout: {
            fields: [],
          },
        },
        init: {
          _scriptId: '62beb29aa0f5f2144816f809',
          function: 'getIntegrationSettings',
        },
      },
      preSave: {
        function: 'processSnowflakeIntegrationSave',
        _scriptId: '62beb29aa0f5f2144816f809',
      },
      installSteps: [
        {
          name: 'Setup Snowflake Connection',
          completed: true,
          type: 'connection',
          sourceConnection: {
            type: 'rdbms',
            rdbms: {
              type: 'snowflake',
            },
            name: 'Snowflake connection',
          },
          _connectionId: '62beb2c2a0f5f2144816f818',
        },
        {
          name: 'Choose data sources',
          description: 'Choose your data sources. You can always choose more data sources later',
          completed: false,
          type: 'form',
          isCurrentStep: true,
          isTriggered: true,
          form: {
            layout: {
              fields: [],
            },
          },
          formMeta: {
            fieldMap: {
              selectSourceApplications: {
                id: 'selectSourceApplications',
                name: 'selectSourceApplications',
                type: 'multiselect',
                helpText: 'Choose your data sources. You can always choose more data sources later.',
                label: 'Choose data sources',
                options: [
                  {
                    items: [
                      {
                        label: 'Magento 2',
                        value: 'magento',
                      },
                      {
                        label: 'Zendesk Support',
                        value: 'zendesk',
                      },
                      {
                        label: 'Shopify',
                        value: 'shopify',
                      },
                      {
                        label: 'Mailchimp',
                        value: 'mailchimp',
                      },
                      {
                        label: 'HubSpot',
                        value: 'hubspot',
                      },
                      {
                        label: 'BigCommerce',
                        value: 'bigcommerce',
                      },
                      {
                        label: 'Returnly',
                        value: 'returnly',
                      },
                      {
                        label: 'Loop Returns',
                        value: 'loopreturns',
                      },
                    ],
                  },
                ],
              },
            },
            layout: {
              fields: [
                'selectSourceApplications',
              ],
            },
          },
          function: 'addAdditionalInstallSteps',
          initFormFunction: 'getSourceApplications',
          _scriptId: '62beb29aa0f5f2144816f809',
        },
      ],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-07-01T08:38:50.705Z',
      _sourceId: '611f3e5482edfc2c354dd721',
    }];
    draft.session.form = {'connections-new-w1g0iscy_': {}};
    draft.session.form['connections-new-w1g0iscy_'] = formProps;
  });

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/62beb29aa0f5f2144816f80c/setup/form/install'}]}
    >
      <Route
        path="/integrations/62beb29aa0f5f2144816f80c/setup"
        params={{}}
        >
        <FormStepDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('formStepDrawer UI tests', () => {
  const mockSubmitHandler = jest.fn();
  const mockCloseHandler = jest.fn();

  test('should render the form correctly', () => {
    const props = {
      integrationId: '62beb29aa0f5f2144816f80c',
      formSubmitHandler: mockSubmitHandler,
      formCloseHandler: mockCloseHandler,
    };

    initFormDrawer(props);
    expect(screen.queryAllByText(/Choose Data Sources/i)).toHaveLength(2);
    expect(screen.getByText(/Please select/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });
  test('should display the dropdown on Clicking Please select', async () => {
    const props = {
      integrationId: '62beb29aa0f5f2144816f80c',
      formSubmitHandler: mockSubmitHandler,
      formCloseHandler: mockCloseHandler,
    };

    initFormDrawer(props);
    await userEvent.click(screen.getByText(/Please select/i));
    expect(screen.getAllByRole('option')).toHaveLength(8);  // 8 options were passed in the formMeta of the integration,hence the value 8//
  });
  test('should run the mockSubmitHandler on clicking submit', async () => {
    const props = {
      integrationId: '62beb29aa0f5f2144816f80c',
      formSubmitHandler: mockSubmitHandler,
      formCloseHandler: mockCloseHandler,
    };

    initFormDrawer(props);
    await userEvent.click(screen.getByText(/Submit/i));
    expect(mockSubmitHandler).toHaveBeenCalled();
  });
  test('should run the mockCloseHandler on clicking', async () => {
    const props = {
      integrationId: '62beb29aa0f5f2144816f80c',
      formSubmitHandler: mockSubmitHandler,
      formCloseHandler: mockCloseHandler,
    };

    initFormDrawer(props);
    const element = document.querySelector('[aria-label="Close"]');

    await userEvent.click(element);
    expect(mockCloseHandler).toHaveBeenCalled();
  });
  test('should run the predefined handleclose function when formCloseHandler is not passed', async () => {
    const props = {
      integrationId: '62beb29aa0f5f2144816f80c',
      formSubmitHandler: jest.fn(),
      formCloseHandler: null,
    };

    initFormDrawer(props);
    const element = document.querySelector('[aria-label="Close"]');

    await userEvent.click(element);
  });
  test('should run the predefined handleSubmit function when formSubmitHandler is not passed,on clicking submit', async () => {
    const props = {
      integrationId: '62beb29aa0f5f2144816f80c',
      formCloseHandler: jest.fn(),
    };

    initFormDrawer(props);

    waitFor(() => expect(screen.getByText(/Submit/i)).toBeInTheDocument());
    await userEvent.click(screen.getByText(/Submit/i));
  });
  test('should render empty DOM when no integrationId is passed', () => {
    const props = {
      integrationId: null,
      formCloseHandler: jest.fn(),
      formSubmitHandler: jest.fn(),
    };
    const ui = (
      <MemoryRouter
        initialEntries={[{pathname: '/integrations/62beb29aa0f5f2144816f80c/setup/ui-drawer/form/install'}]}
    >
        <Route
          path="/integrations/62beb29aa0f5f2144816f80c/setup"
          params={{}}
        >
          <FormStepDrawer {...props} />
        </Route>
      </MemoryRouter>
    );
    const {utils} = renderWithProviders(ui);

    expect(utils.container).toBeEmptyDOMElement();
  });
});


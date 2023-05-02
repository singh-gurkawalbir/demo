
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import ErrorsListDrawer from './index';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/LoadResources'),
  default: props => (<div>{props.children}</div>),
}));

const imports = [
  {
    _id: '60c9b550a4004f2e4cfe72fc',
    createdAt: '2021-06-16T08:24:48.308Z',
    lastModified: '2022-02-02T06:56:33.387Z',
    name: 'Post customer to HubSpot companies',
    sandbox: false,
    adaptorType: 'HTTPImport',
  },
];
const exports = [
  {
    _id: '60c9b550a4004f2e4cfe72fc',
    type: 'simple',
    createdAt: '2021-06-16T08:24:48.308Z',
    lastModified: '2022-02-02T06:56:33.387Z',
    name: 'Post customer to HubSpot companies',
    sandbox: false,
    adaptorType: 'HTTPImport',
  },
];
const integrations = [{
  _id: '60c9b4a7a4004f2e4cfe72b6',
  lastModified: '2022-02-02T06:56:33.634Z',
  name: 'HubSpot - NetSuite',
  description: 'The HubSpot - NetSuite Integration App integrates HubSpot with NetSuite.',
  _connectorId: '60aca16805eb397d176e5496',
  install: [],
  mode: 'settings',
  settings: {
    saveHubSpotProperties: false,
  },
  version: '1.0.0',
  tag: 'Production ',
  sandbox: false,
  _registeredConnectionIds: [],
  settingsForm: {
    init: {
      _scriptId: '604745e789b5f0662a8264b1',
      function: 'getHubSpotGeneralSettings',
    },
  },
  preSave: {
    function: 'processHubSpotSettingSave',
    _scriptId: '604745e789b5f0662a8264b1',
  },
  installSteps: [
    {
      name: 'Configure HubSpot connection',
      description: 'Lets you create a connection with HubSpot. You can authenticate your connection either using OAuth or token.The recommended authentication type is OAuth.',
      completed: true,
      type: 'connection',
      function: 'verifyHubSpotConfigurations',
      _scriptId: '604745e789b5f0662a8264b1',
      sourceConnection: {
        type: 'http',
        name: 'HubSpot connection [HubSpot - NetSuite Integration App]',
        assistant: 'hubspot',
        externalId: 'hubspot_connection',
      },
    },
    {
      name: 'Configure NetSuite connection',
      description: "Lets you create a connection to NetSuite. You can authenticate your connection using the recommended token or automatic token options. For token-based authentication, first create an access token in NetSuite. After configuring, you won't be able to change the NetSuite environment and account.",
      completed: true,
      type: 'connection',
      function: 'verifyNetSuiteConfigurations',
      _scriptId: '604745e789b5f0662a8264b1',
      sourceConnection: {
        type: 'netsuite',
        externalId: 'netsuite_connection',
        name: 'NetSuite connection [HubSpot - NetSuite Integration App]',
      },
    },
    {
      name: 'Install integrator.io bundle in NetSuite',
      description: 'Lets you install the integrator.io bundle (20037) in NetSuite. It is a common bundle across all integration apps. After installing, verify the bundle.',
      completed: true,
      type: 'url',
      url: 'https://tstdrv2024144.app.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV840460&domain=PRODUCTION&config=F&id=20037',
      function: 'verifyIntegratorBundleInstallation',
      _scriptId: '604745e789b5f0662a8264b1',
    },
    {
      name: 'Install HubSpot SuiteApp in NetSuite',
      description: 'Lets you install the HubSpot SuiteApp in NetSuite.',
      completed: true,
      type: 'edition',
      url: 'https://tstdrv2024144.app.netsuite.com/suiteapp/ui/marketplace.nl?whence=#/app?id=com.celigo.hubspotia',
      function: 'verifyProductBundleInstallation',
      _scriptId: '604745e789b5f0662a8264b1',
    },
  ],
  uninstallSteps: [],
  flowGroupings: [
    {
      name: 'Company',
      _id: '60ac927a05eb397d176e4c43',
    },
    {
      name: 'Contact',
      _id: '60ac927a05eb397d176e4c42',
    },
  ],
  createdAt: '2021-06-16T08:21:59.721Z',
}];
const flows = [
  {
    _id: '60c9b551a4004f2e4cfe730e',
    lastModified: '2021-08-12T13:34:12.819Z',
    name: 'NetSuite customer to HubSpot company',
    _integrationId: '60c9b4a7a4004f2e4cfe72b6',
    _connectorId: '60aca16805eb397d176e5496',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [
            {
              generate: 'custentity_celigo_hubspot_id',
              extract: 'data[0].id',
            },
            {
              extract: 'data[0].id',
              generate: 'shouldIdWriteBack',
            },
          ],
          lists: [],
        },
        type: 'export',
        _exportId: '60c9b54fa4004f2e4cfe72f3',
      },
      {
        responseMapping: {
          fields: [
            {
              extract: 'id',
              generate: 'hubspotid',
            },
          ],
          lists: [],
        },
        type: 'import',
        _importId: '60c9b550a4004f2e4cfe72fc',
      },
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '60c9b550a4004f2e4cfe72ff',
      },
    ],
    pageGenerators: [
      {
        _exportId: '60c9b546a4004f2e4cfe72eb',
        skipRetries: false,
      },
    ],
    createdAt: '2021-06-16T08:24:49.094Z',
    externalId: 'netsuite_customer_to_hubspot_company',
    _sourceId: '60ac9e01155176722dd209a3',
    lastExecutedAt: '2022-08-10T12:53:16.531Z',
    _flowGroupingId: '60ac927a05eb397d176e4c43',
  },
];

describe('ErrorsListDrawer UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function iniStoreAndRender(count, noIntegration, isUserInErrMgtTwoDotZero) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources._integrations = integrations;

      draft.data.resources.flows = flows;
      draft.data.resources.imports = imports;
      draft.session.errorManagement.openErrors = {
        '60c9b4a7a4004f2e4cfe72b6': {
          status: 'received',
          data: {
            '60c9b551a4004f2e4cfe730e': {
              _flowId: '60c9b551a4004f2e4cfe730e',
              numError: count,
              lastErrorAt: '2022-08-04T11:09:35.048Z',
            },
          },
        },
        '60c9b551a4004f2e4cfe730e': {
          status: 'received',
          data: {
            '60c9b550a4004f2e4cfe72fc': {
              _expOrImpId: '60c9b550a4004f2e4cfe72fc',
              numError: count,
              lastErrorAt: '2022-08-04T11:09:35.048Z',
            },
          },
        },
      };

      draft.user.profile = {
        useErrMgtTwoDotZero: isUserInErrMgtTwoDotZero,
        timezone: 'Asia/Calcutta',
      };
    });

    return renderWithProviders(
      <MemoryRouter initialEntries={['/initialURL/60c9b551a4004f2e4cfe730e/errorsList']}>
        <Route path="/:initialUrl">
          <ErrorsListDrawer integrationId={noIntegration ? null : '60c9b4a7a4004f2e4cfe72b6'} />
        </Route>
      </MemoryRouter>, {initialStore});
  }
  test('should test the content of celigo table', () => {
    iniStoreAndRender(4);

    const rows = screen.getAllByRole('row');

    const header = rows.find(({textContent}) => textContent === 'ApplicationTypeFlow step nameErrorsLast open error');

    expect(header).toBeInTheDocument();
    const rowContent = rows.find(({textContent}) => textContent === 'ImportPost customer to HubSpot companies4 errors08/04/2022 11:09:35 am');

    expect(rowContent).toBeInTheDocument();
  });

  test('should test the celigo table when integrationId is not provided', () => {
    iniStoreAndRender(4, true);

    const rows = screen.getAllByRole('row');

    expect(rows[0].textContent).toBe('ApplicationTypeFlow step nameErrorsLast open error');
    expect(rows[1].textContent).toBe('ImportPost customer to HubSpot companies4 errors08/04/2022 11:09:35 am');
  });
  test('should click the close button', async () => {
    iniStoreAndRender(0);

    const closeButton = screen.getByRole('button', {name: /close/i});

    await userEvent.click(closeButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/initialURL');
  });
  test('should click on the error when error count < 9999', async () => {
    iniStoreAndRender(4);

    const errors = screen.getByText('4 errors');

    expect(errors).toBeInTheDocument();

    await userEvent.click(errors);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrations/60c9b4a7a4004f2e4cfe72b6/flowBuilder/60c9b551a4004f2e4cfe730e/errors/60c9b550a4004f2e4cfe72fc/open'
    );
  });
  test('should click on the error  when error count > 9999', async () => {
    iniStoreAndRender(10000);

    const errors = screen.getByText('9999+ errors');

    expect(errors).toBeInTheDocument();

    await userEvent.click(errors);
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrations/60c9b4a7a4004f2e4cfe72b6/flowBuilder/60c9b551a4004f2e4cfe730e/errors/60c9b550a4004f2e4cfe72fc/open'
    );
  });
  test('should click on the success  when error count is 0', async () => {
    iniStoreAndRender(0);

    await userEvent.click(screen.getByText('Success'));
    expect(mockHistoryPush).toHaveBeenCalledWith(
      '/integrations/60c9b4a7a4004f2e4cfe72b6/flowBuilder/60c9b551a4004f2e4cfe730e/errors/60c9b550a4004f2e4cfe72fc/open'
    );
  });
  test('should the case when non existing flow id is provided', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/initialURL/60c9b551a4004f2e4cfe730f/errorsList']}>
        <Route path="/:initialUrl">
          <ErrorsListDrawer integrationId="60c9b4a7a4004f2e4cfe72b6" />
        </Route>
      </MemoryRouter>);

    expect(screen.getByText('Flow: 60c9b551a4004f2e4cfe730f')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test useEffect dispatch call when isUserInErrMgtTwoDotZero is true', () => {
    const {utils} = iniStoreAndRender(0, false, true);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'FLOW_OPEN_ERRORS_REQUEST_FOR_POLL',
        flowId: '60c9b551a4004f2e4cfe730e',
      }
    );
    utils.unmount();
    expect(mockDispatch).toHaveBeenCalledWith(
      { type: 'FLOW_OPEN_ERRORS_CANCEL_POLL' }
    );
  });
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('should click the import buttton', () => {
  //   iniStoreAndRender(4);

  //   await userEvent.click(screen.getByText('Import'));
  // });
  test('should test when flow is dataloader', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources._integrations = integrations;

      draft.data.resources.flows = flows;
      draft.data.resources.imports = imports;
      draft.data.resources.exports = exports;
      draft.session.errorManagement.openErrors = {
        '60c9b4a7a4004f2e4cfe72b6': {
          status: 'received',
          data: {
            '60c9b551a4004f2e4cfe730e': {
              _flowId: '60c9b551a4004f2e4cfe730e',
              numError: 0,
              lastErrorAt: '2022-08-04T11:09:35.048Z',
            },
          },
        },
        '60c9b551a4004f2e4cfe730e': {
          status: 'received',
          data: {
            '60c9b550a4004f2e4cfe72fc': {
              _expOrImpId: '60c9b550a4004f2e4cfe72fc',
              numError: 0,
              lastErrorAt: '2022-08-04T11:09:35.048Z',
            },
          },
        },
      };

      draft.user.profile = {
        useErrMgtTwoDotZero: false,
        timezone: 'Asia/Calcutta',
      };
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['/initialURL/60c9b551a4004f2e4cfe730e/errorsList']}>
        <Route path="/:initialUrl">
          <ErrorsListDrawer integrationId="60c9b4a7a4004f2e4cfe72b6" />
        </Route>
      </MemoryRouter>, {initialStore});

    expect(screen.getByText('Data loader')).toBeInTheDocument();
  });
  test('should test when flow is not provided from match params', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter>
        <ErrorsListDrawer />
      </MemoryRouter>);

    expect(utils.container.textContent).toBe('');
  });
});


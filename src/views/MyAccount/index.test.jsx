import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import MyAccount from '.';
import { getCreatedStore } from '../../store';

let initialStore;

function store(accounts) {
  initialStore.getState().user.org.accounts = accounts;
  initialStore.getState().user.profile = {
    _id: '5d4010e14cd24a7c773122ef',
    name: 'Chaitanya Reddy Mula',
    email: 'chaitanyareddy.mule@celigo.com',
    role: '',
    company: 'Celigo',
    phone: '8309441737',
    auth_type_google: {},
    timezone: 'Asia/Calcutta',
    developer: true,
    agreeTOSAndPP: true,
    createdAt: '2019-07-30T09:41:54.435Z',
    useErrMgtTwoDotZero: false,
    authTypeSSO: null,
    emailHash: '8a859a6cc8996b65d364a1ce1e7a3820',
  };
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    drawerOpened: true,
    expand: 'Resources',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: accounts[0].defaultAShareId,
    fbBottomDrawerHeight: 114,
    lastLoginAt: '2022-01-25T07:36:20.829Z',
    dashboard: {
      tilesOrder: [
        '5fc5e0e66cfe5b44bb95de70',
      ],
      view: 'tile',
    },
    recentActivity: {
      production: {
        integration: '60c1b4aea4004f2e4cfcb84f',
        flow: '60cf3ec4a4004f2e4cff3af7',
      },
    },
  };
  initialStore.getState().session.form = {
    'new-Xf_gJO98f': {
      parentContext: {
        skipMonitorLevelAccessCheck: true,
      },
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          name: {
            id: 'name',
            name: 'name',
            type: 'text',
            label: 'Name',
            required: true,
            helpKey: 'myaccount.name',
            noApi: true,
            defaultValue: 'Chaitanya Reddy Mula',
            isLoggable: false,
          },
          email: {
            id: 'email',
            name: 'email',
            type: 'useremail',
            label: 'Email',
            helpKey: 'myaccount.email',
            noApi: true,
            readOnly: false,
            value: 'chaitanyareddy.mule@celigo.com',
            isLoggable: false,
          },
          password: {
            id: 'password',
            name: 'password',
            label: 'Password',
            helpKey: 'myaccount.password',
            noApi: true,
            type: 'userpassword',
            visible: true,
            isLoggable: false,
          },
          company: {
            id: 'company',
            name: 'company',
            type: 'text',
            label: 'Company',
            helpKey: 'myaccount.company',
            noApi: true,
            defaultValue: 'Celigo',
            isLoggable: false,
          },
          phone: {
            id: 'phone',
            name: 'phone',
            type: 'text',
            label: 'Phone',
            helpKey: 'myaccount.phone',
            noApi: true,
            defaultValue: '8309441737',
            isLoggable: false,
          },
          role: {
            id: 'role',
            name: 'role',
            type: 'text',
            helpKey: 'myaccount.role',
            noApi: true,
            label: 'Role',
            defaultValue: '',
            isLoggable: false,
          },
          timezone: {
            id: 'timezone',
            name: 'timezone',
            type: 'select',
            label: 'Time zone',
            required: true,
            helpKey: 'myaccount.timezone',
            noApi: true,
            defaultValue: 'Asia/Calcutta',
            options: [
              {
                items: [
                  {
                    label: '(GMT-12:00) International Date Line West',
                    value: 'Etc/GMT+12',
                  },
                  {
                    label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                    value: 'Asia/Calcutta',
                  },
                ],
              },
            ],
            isLoggable: false,
          },
          dateFormat: {
            id: 'dateFormat',
            name: 'dateFormat',
            type: 'select',
            required: true,
            helpKey: 'myaccount.dateFormat',
            noApi: true,
            label: 'Date format',
            defaultValue: 'MM/DD/YYYY',
            options: [
              {
                items: [
                  {
                    label: '12/31/1900',
                    value: 'MM/DD/YYYY',
                  },
                  {
                    label: '31/12/1900',
                    value: 'DD/MM/YYYY',
                  },
                  {
                    label: '31-Dec-1900',
                    value: 'DD-MMM-YYYY',
                  },
                  {
                    label: '31.12.1900',
                    value: 'DD.MM.YYYY',
                  },
                  {
                    label: '31-December-1900',
                    value: 'DD-MMMM-YYYY',
                  },
                  {
                    label: '31 December, 1900',
                    value: 'DD MMMM, YYYY',
                  },
                  {
                    label: '1900/12/31',
                    value: 'YYYY/MM/DD',
                  },
                  {
                    label: '1900-12-31',
                    value: 'YYYY-MM-DD',
                  },
                ],
              },
            ],
            isLoggable: true,
          },
          timeFormat: {
            id: 'timeFormat',
            name: 'timeFormat',
            type: 'select',
            helpKey: 'myaccount.timeFormat',
            noApi: true,
            required: true,
            label: 'Time format',
            defaultValue: 'h:mm:ss a',
            options: [
              {
                items: [
                  {
                    label: '2:34:25 pm',
                    value: 'h:mm:ss a',
                  },
                  {
                    label: '14:34:25',
                    value: 'H:mm:ss',
                  },
                ],
              },
            ],
            isLoggable: true,
          },
          showRelativeDateTime: {
            id: 'showRelativeDateTime',
            name: 'showRelativeDateTime',
            type: 'checkbox',
            helpKey: 'myaccount.showRelativeDateTime',
            noApi: true,
            label: 'Show timestamps as relative',
            isLoggable: true,
          },
          developer: {
            id: 'developer',
            name: 'developer',
            type: 'checkbox',
            helpKey: 'myaccount.developer',
            noApi: true,
            label: 'Developer mode',
            defaultValue: true,
            isLoggable: true,
          },
        },
        layout: {
          fields: [
            'name',
            'email',
            'password',
            'company',
            'role',
            'phone',
            'timezone',
            'dateFormat',
            'timeFormat',
            'showRelativeDateTime',
            'developer',
          ],
        },
      },
      remountKey: 1,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        name: {
          id: 'name',
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          helpKey: 'myaccount.name',
          noApi: true,
          defaultValue: 'Chaitanya Reddy Mula',
          isLoggable: false,
          defaultRequired: true,
          value: 'Chaitanya Reddy Mula',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        email: {
          id: 'email',
          name: 'email',
          type: 'useremail',
          label: 'Email',
          helpKey: 'myaccount.email',
          noApi: true,
          readOnly: false,
          value: 'chaitanyareddy.mule@celigo.com',
          isLoggable: false,
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        password: {
          id: 'password',
          name: 'password',
          label: 'Password',
          helpKey: 'myaccount.password',
          noApi: true,
          type: 'userpassword',
          visible: true,
          isLoggable: false,
          defaultVisible: true,
          touched: false,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        company: {
          id: 'company',
          name: 'company',
          type: 'text',
          label: 'Company',
          helpKey: 'myaccount.company',
          noApi: true,
          defaultValue: 'Celigo',
          isLoggable: false,
          value: 'Celigo',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        phone: {
          id: 'phone',
          name: 'phone',
          type: 'text',
          label: 'Phone',
          helpKey: 'myaccount.phone',
          noApi: true,
          defaultValue: '8309441737',
          isLoggable: false,
          value: '8309441737',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        role: {
          id: 'role',
          name: 'role',
          type: 'text',
          helpKey: 'myaccount.role',
          noApi: true,
          label: 'Role',
          defaultValue: '',
          isLoggable: false,
          value: '',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        timezone: {
          id: 'timezone',
          name: 'timezone',
          type: 'select',
          label: 'Time zone',
          required: true,
          helpKey: 'myaccount.timezone',
          noApi: true,
          defaultValue: 'Asia/Calcutta',
          options: [
            {
              items: [
                {
                  label: '(GMT-12:00) International Date Line West',
                  value: 'Etc/GMT+12',
                },
                {
                  label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                  value: 'Asia/Calcutta',
                },
              ],
            },
          ],
          isLoggable: false,
          defaultRequired: true,
          value: 'Asia/Calcutta',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        dateFormat: {
          id: 'dateFormat',
          name: 'dateFormat',
          type: 'select',
          required: true,
          helpKey: 'myaccount.dateFormat',
          noApi: true,
          label: 'Date format',
          defaultValue: 'MM/DD/YYYY',
          options: [
            {
              items: [
                {
                  label: '12/31/1900',
                  value: 'MM/DD/YYYY',
                },
                {
                  label: '31-Dec-1900',
                  value: 'DD-MMM-YYYY',
                },
              ],
            },
          ],
          isLoggable: true,
          defaultRequired: true,
          value: 'MM/DD/YYYY',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        timeFormat: {
          id: 'timeFormat',
          name: 'timeFormat',
          type: 'select',
          helpKey: 'myaccount.timeFormat',
          noApi: true,
          required: true,
          label: 'Time format',
          defaultValue: 'h:mm:ss a',
          options: [
            {
              items: [
                {
                  label: '2:34:25 pm',
                  value: 'h:mm:ss a',
                },
                {
                  label: '14:34:25',
                  value: 'H:mm:ss',
                },
              ],
            },
          ],
          isLoggable: true,
          defaultRequired: true,
          value: 'h:mm:ss a',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        showRelativeDateTime: {
          id: 'showRelativeDateTime',
          name: 'showRelativeDateTime',
          type: 'checkbox',
          helpKey: 'myaccount.showRelativeDateTime',
          noApi: true,
          label: 'Show timestamps as relative',
          isLoggable: true,
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        developer: {
          id: 'developer',
          name: 'developer',
          type: 'checkbox',
          helpKey: 'myaccount.developer',
          noApi: true,
          label: 'Developer mode',
          defaultValue: true,
          isLoggable: true,
          value: true,
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
      },
      value: {
        name: 'Chaitanya Reddy Mula',
        email: 'chaitanyareddy.mule@celigo.com',
        company: 'Celigo',
        phone: '8309441737',
        role: '',
        timezone: 'Asia/Calcutta',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss a',
        developer: true,
      },
      isValid: true,
    },
    'new-2XKB4Dov0u': {
      parentContext: {},
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          newEmail: {
            id: 'newEmail',
            name: 'newEmail',
            type: 'text',
            label: 'New email',
            required: true,
            isLoggable: false,
          },
          password: {
            id: 'password',
            name: 'password',
            type: 'text',
            inputType: 'password',
            label: 'Password',
            required: true,
            isLoggable: false,
          },
          label: {
            id: 'label',
            name: 'label',
            type: 'labeltitle',
            label: 'Note: we require your current password again to help safeguard your integrator.io account.',
          },
        },
        layout: {
          fields: [
            'newEmail',
            'password',
            'label',
          ],
        },
      },
      remountKey: false,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        newEmail: {
          id: 'newEmail',
          name: 'newEmail',
          type: 'text',
          label: 'New email',
          required: true,
          isLoggable: false,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
        password: {
          id: 'password',
          name: 'password',
          type: 'text',
          inputType: 'password',
          label: 'Password',
          required: true,
          isLoggable: false,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
        label: {
          id: 'label',
          name: 'label',
          type: 'labeltitle',
          label: 'Note: we require your current password again to help safeguard your integrator.io account.',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
      },
      value: {},
      isValid: false,
    },
    'new-0mK4wMtr7w': {
      parentContext: {},
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          currentPassword: {
            id: 'currentPassword',
            name: 'currentPassword',
            type: 'text',
            inputType: 'password',
            label: 'Current password',
            required: true,
          },
          newPassword: {
            id: 'newPassword',
            name: 'newPassword',
            type: 'text',
            inputType: 'password',
            label: 'New password',
            required: true,
          },
        },
        layout: {
          fields: [
            'currentPassword',
            'newPassword',
          ],
        },
      },
      remountKey: false,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        currentPassword: {
          id: 'currentPassword',
          name: 'currentPassword',
          type: 'text',
          inputType: 'password',
          label: 'Current password',
          required: true,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
        newPassword: {
          id: 'newPassword',
          name: 'newPassword',
          type: 'text',
          inputType: 'password',
          label: 'New password',
          required: true,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
      },
      value: {},
      isValid: false,
    },
  };
  initialStore.getState().session.resource.numEnabledFlows = {
    numEnabledSandboxFlows: 0,
    numEnabledFreeFlows: 0,
    numEnabledPaidFlows: 91,
  };
}

async function initMyAccount(match, tab) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: match.url}]}
    >
      <Route
        path="/myAccount/:tab"
        params={{tab: {tab}}}
        >
        <MyAccount match={match} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('myAccount', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    cleanup();
  });
  test('should able to acess the profile tab with owner access', async () => {
    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/profile',
      isExact: true,
      params: {
        tab: 'profile',
      },
    };

    await initMyAccount(match, match.params.tab);
    expect(screen.getByText('My account')).toBeInTheDocument();

    expect(screen.getByText('Profile')).toBeInTheDocument();

    expect(screen.getByText('Users')).toBeInTheDocument();

    expect(screen.getByText('Subscription')).toBeInTheDocument();

    expect(screen.getByText('Audit log')).toBeInTheDocument();

    expect(screen.getByText('Transfers')).toBeInTheDocument();

    expect(screen.getByText('Security')).toBeInTheDocument();

    expect(screen.getByText('Data retention')).toBeInTheDocument();
  });
  test('should able to acess the subscription tab', async () => {
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/subscription',
      isExact: true,
      params: {
        tab: 'subscription',
      },
    };

    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    await initMyAccount(match, match.params.tab);

    const subscriptionText = screen.getByRole('tab', {name: 'Subscription'});

    expect(subscriptionText).toBeInTheDocument();
  });
  test('should able to access the Myaccount tab with the account which has manage access', async () => {
    const accounts = [
      {
        _id: '12345',
        accessLevel: 'manage',
        defaultAShareId: '6040b99a7671bb3ddf6a3abc',
      },
    ];

    store(accounts);
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/profile',
      isExact: true,
      params: {
        tab: 'profile',
      },
    };

    await initMyAccount(match, match.params.tab);
    const profileTabNode = screen.getByRole('tab', {name: 'Profile'});

    expect(profileTabNode).toBeInTheDocument();
    const securityTabNode = screen.getByRole('tab', {name: 'Security'});

    expect(securityTabNode).toBeInTheDocument();
    const tabCount = screen.getAllByRole('tab');

    expect(tabCount).toHaveLength(2);
  });
  test('should able to acess the audit tab', async () => {
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/audit',
      isExact: true,
      params: {
        tab: 'audit',
      },
    };

    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    await initMyAccount(match, match.params.tab);

    const auditText = screen.getByRole('tab', {name: 'Audit log'});

    expect(auditText).toBeInTheDocument();
  });
  test('should able to acess the transfers tab', async () => {
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/transfers',
      isExact: true,
      params: {
        tab: 'transfers',
      },
    };

    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    await initMyAccount(match, match.params.tab);

    const transfersText = screen.getByRole('tab', {name: 'Transfers'});

    expect(transfersText).toBeInTheDocument();
  });
  test('should able to acess the security tab', async () => {
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/security',
      isExact: true,
      params: {
        tab: 'security',
      },
    };

    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    await initMyAccount(match, match.params.tab);

    const securityText = screen.getByRole('tab', {name: 'Security'});

    expect(securityText).toBeInTheDocument();
  });
  test('should able to acess the data retention tab', async () => {
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/dataretention',
      isExact: true,
      params: {
        tab: 'dataretention',
      },
    };

    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    await initMyAccount(match, match.params.tab);

    const dataretentionText = screen.getByRole('tab', {name: 'Data retention'});

    expect(dataretentionText).toBeInTheDocument();
  });
});

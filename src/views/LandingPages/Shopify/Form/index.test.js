import { screen } from '@testing-library/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AddOrSelectForm from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';

let initialStore;
const mockOptionsHandler = jest.fn();
const mockPatchSet = jest.fn();
const mockUseHandleSubmit = jest.fn();
const mockHistoryReplace = jest.fn();

function initAddOrSelectForm({
  resourceId,
  resourceType,
  selectedAccountHasSandbox,
  helpURL,
  formData,
  asyncTaskData,
  urlExtenstionData = undefined,
  connectionData,
}) {
  mutateStore(initialStore, draft => {
    draft.session.resourceForm = {
      'connections-12345': {
        initData: null,
        isNew: false,
        skipCommit: false,
        initComplete: true,
        fieldMeta: {
          layout: {
            containers: [
              {
                type: 'box',
                containers: [
                  {
                    fields: [
                      'name',
                      'http.unencrypted.version',
                      'http.storeName',
                      'http.auth.type',
                      'http.auth.oauth.scope',
                    ],
                  },
                ],
              },
              {
                type: 'collapse',
                containers: [
                  {
                    collapsed: true,
                    label: 'Advanced',
                    fields: [
                      '_borrowConcurrencyFromConnectionId',
                      'http.concurrencyLevel',
                    ],
                  },
                ],
              },
            ],
          },
          fieldMap: {
            name: {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: 'name',
              name: '/name',
              label: 'Name your connection',
              helpKey: 'connection.name',
              required: true,
              type: 'text',
              placeholder: 'e.g., Shopify connection',
              visible: true,
              defaultValue: '',
            },
            'http.unencrypted.version': {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: 'http.unencrypted.version',
              name: '/http/unencrypted/version',
              type: 'select',
              label: 'API version',
              required: true,
              helpKey: 'shopify.connection.http.unencrypted.version',
              defaultValue: '2022-10',
              options: [
                {
                  items: [
                    {
                      label: '2022-04',
                      value: '2022-04',
                    },
                    {
                      label: '2022-07',
                      value: '2022-07',
                    },
                    {
                      label: '2022-10',
                      value: '2022-10',
                    },
                  ],
                },
              ],
              visible: true,
            },
            'http.storeName': {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: 'http.storeName',
              name: '/http/storeName',
              type: 'shopifystorename',
              label: 'Store name',
              helpKey: 'shopify.connection.http.storeURL',
              required: true,
              validWhen: {
                matchesRegEx: {
                  pattern: '^[a-zA-Z0-9][a-zA-Z0-9-]*',
                  message: 'not a valid Store name.',
                },
              },
              defaultDisabled: true,
              visible: true,
            },
            'http.auth.type': {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: 'http.auth.type',
              name: '/http/auth/type',
              type: 'select',
              label: 'Auth type',
              required: true,
              helpKey: 'shopify.connection.http.auth.type',
              options: [
                {
                  items: [
                    {
                      label: 'Basic',
                      value: 'basic',
                    },
                    {
                      label: 'OAuth 2.0',
                      value: 'oauth',
                    },
                  ],
                },
              ],
              defaultValue: 'oauth',
              defaultDisabled: true,
              visible: true,
            },
            'http.auth.oauth.scope': {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: 'http.auth.oauth.scope',
              name: '/http/auth/oauth/scope',
              type: 'selectscopes',
              isLoggable: true,
              label: 'Configure scopes',
              scopes: [
                {
                  subHeader: 'Shopify scopes',
                  scopes: [
                    'read_content',
                    'write_content',
                    'read_themes',
                    'write_themes',
                    'read_products',
                    'write_products',
                    'read_product_listings',
                    'read_customers',
                    'write_customers',
                    'read_orders',
                    'write_orders',
                    'read_all_orders',
                    'read_draft_orders',
                    'write_draft_orders',
                    'read_inventory',
                    'write_inventory',
                    'read_locations',
                    'read_script_tags',
                    'write_script_tags',
                    'read_fulfillments',
                    'write_fulfillments',
                    'read_shipping',
                    'write_shipping',
                    'read_analytics',
                    'read_checkouts',
                    'write_checkouts',
                    'read_reports',
                    'write_reports',
                    'read_price_rules',
                    'write_price_rules',
                    'read_marketing_events',
                    'write_marketing_events',
                    'read_resource_feedbacks',
                    'write_resource_feedbacks',
                    'read_shopify_payments_payouts',
                    'unauthenticated_read_product_listings',
                    'unauthenticated_write_checkouts',
                    'unauthenticated_write_customers',
                    'unauthenticated_read_content',
                    'read_assigned_fulfillment_orders',
                    'write_assigned_fulfillment_orders',
                    'read_merchant_managed_fulfillment_orders',
                    'write_merchant_managed_fulfillment_orders',
                    'read_third_party_fulfillment_orders',
                    'write_third_party_fulfillment_orders',
                  ],
                },
                {
                  subHeader: 'Shopify Plus scopes',
                  scopes: [
                    'read_users',
                    'write_users',
                    'read_gift_cards',
                    'write_gift_cards',
                  ],
                },
              ],
              helpKey: 'connection.http.auth.oauth.scope',
              required: true,
              defaultValue: [
                'read_content',
                'write_content',
                'read_themes',
                'write_themes',
                'read_products',
                'write_products',
                'read_product_listings',
                'read_customers',
                'write_customers',
                'read_orders',
                'write_orders',
                'read_all_orders',
                'read_draft_orders',
                'write_draft_orders',
                'read_inventory',
                'write_inventory',
                'read_locations',
                'read_script_tags',
                'write_script_tags',
                'read_fulfillments',
                'write_fulfillments',
                'read_shipping',
                'write_shipping',
                'read_analytics',
                'read_checkouts',
                'write_checkouts',
                'read_reports',
                'write_reports',
                'read_price_rules',
                'write_price_rules',
                'read_marketing_events',
                'write_marketing_events',
                'read_resource_feedbacks',
                'write_resource_feedbacks',
                'read_shopify_payments_payouts',
                'unauthenticated_read_product_listings',
                'unauthenticated_write_checkouts',
                'unauthenticated_write_customers',
                'unauthenticated_read_content',
                'read_assigned_fulfillment_orders',
                'write_assigned_fulfillment_orders',
                'read_merchant_managed_fulfillment_orders',
                'write_merchant_managed_fulfillment_orders',
                'read_third_party_fulfillment_orders',
                'write_third_party_fulfillment_orders',
              ],
              pathToScopeField: 'http.auth.oauth.scope',
              refreshOptionsOnChangesTo: [
                'resourceId',
              ],
              visible: false,
            },
            _borrowConcurrencyFromConnectionId: {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: '_borrowConcurrencyFromConnectionId',
              isLoggable: true,
              filter: {
                $and: [
                  {
                    _id: {
                      $ne: 'new-BbFj855u2d8',
                    },
                  },
                  {},
                ],
              },
              type: 'selectresource',
              label: 'Borrow concurrency from',
              name: '/_borrowConcurrencyFromConnectionId',
              visible: true,
              defaultValue: '',
              helpKey: 'connection._borrowConcurrencyFromConnectionId',
            },
            'http.concurrencyLevel': {
              resourceId: 'new-BbFj855u2d8',
              resourceType: 'connections',
              id: 'http.concurrencyLevel',
              isLoggable: true,
              label: 'Concurrency level',
              type: 'select',
              options: [
                {
                  items: [
                    {
                      label: '1',
                      value: 1,
                    },
                    {
                      label: '2',
                      value: 2,
                    },
                    {
                      label: '3',
                      value: 3,
                    },
                    {
                      label: '4',
                      value: 4,
                    },
                    {
                      label: '5',
                      value: 5,
                    },
                    {
                      label: '6',
                      value: 6,
                    },
                    {
                      label: '7',
                      value: 7,
                    },
                    {
                      label: '8',
                      value: 8,
                    },
                    {
                      label: '9',
                      value: 9,
                    },
                    {
                      label: '10',
                      value: 10,
                    },
                    {
                      label: '11',
                      value: 11,
                    },
                    {
                      label: '12',
                      value: 12,
                    },
                    {
                      label: '13',
                      value: 13,
                    },
                    {
                      label: '14',
                      value: 14,
                    },
                    {
                      label: '15',
                      value: 15,
                    },
                    {
                      label: '16',
                      value: 16,
                    },
                    {
                      label: '17',
                      value: 17,
                    },
                    {
                      label: '18',
                      value: 18,
                    },
                    {
                      label: '19',
                      value: 19,
                    },
                    {
                      label: '20',
                      value: 20,
                    },
                    {
                      label: '21',
                      value: 21,
                    },
                    {
                      label: '22',
                      value: 22,
                    },
                    {
                      label: '23',
                      value: 23,
                    },
                    {
                      label: '24',
                      value: 24,
                    },
                    {
                      label: '25',
                      value: 25,
                    },
                  ],
                },
              ],
              visibleWhen: [
                {
                  field: '_borrowConcurrencyFromConnectionId',
                  is: [
                    '',
                  ],
                },
              ],
              name: '/http/concurrencyLevel',
              visible: true,
              defaultValue: '',
              helpKey: 'connection.http.concurrencyLevel',
            },
          },
          actions: [
            {
              id: 'oauthandcancel',
            },
          ],
        },
        showValidationBeforeTouched: false,
      },
    };
    draft.data.resources.connections = connectionData || null;
    draft.session.form = formData || {
      'connections-12345': {
        parentContext: {},
        disabled: false,
        showValidationBeforeTouched: false,
        conditionalUpdate: false,
        remountKey: 1,
        formIsDisabled: false,
        resetTouchedState: false,
        fields: {
          resourceId: {
            id: 'resourceId',
            name: '/resourceId',
            type: 'shopifyconnectionselect',
            placeholder: 'Select',
            resourceType: 'connections',
            required: true,
            label: 'Connection',
            options: {
              filter: {
                $and: [
                  {
                    $or: [
                      {
                        type: 'rest',
                      },
                      {
                        type: 'http',
                      },
                    ],
                  },
                  {
                    _connectorId: {
                      $exists: false,
                    },
                  },
                  {
                    assistant: 'shopify',
                  },
                ],
              },
              appType: 'shopify',
            },
            isValueValid: true,
            defaultValue: '',
            appTypeIsStatic: true,
            removeHelperText: true,
            visible: true,
            defaultVisible: true,
            defaultRequired: true,
            value: '61ae1dce782aab51339b59cb',
            touched: true,
            disabled: false,
            isValid: true,
            isDiscretelyInvalid: false,
            errorMessages: '',
          },
        },
        value: {
          '/resourceId': '61ae1dce782aab51339b59cb',
          '/http/unencrypted/version': '2022-10',
          '/http/auth/type': 'oauth',
        },
        isValid: true,
        lastFieldUpdated: 'resourceId',
      },
    };
    draft.session.asyncTask = asyncTaskData || null;
  });
  const ui = (
    <MemoryRouter
      initialEntries={[urlExtenstionData]}
    >
      <AddOrSelectForm
        resourceId={resourceId}
        resourceType={resourceType}
        selectedAccountHasSandbox={selectedAccountHasSandbox}
        helpURL={helpURL}
    />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

// Mocking Form Header as part of unit testing
jest.mock('./Header', () => ({
  __esModule: true,
  ...jest.requireActual('./Header'),
  default: props => (
    <>
      <div>Mock Form Header</div>
      <div>selectedAccountHasSandbox = {props.selectedAccountHasSandbox}</div>
      <div>helpURL = {props.helpURL}</div>
      <button type="button" onClick={props.handleToggle} >handleToggle</button>
    </>
  ),
}));

// Mocking Form Header as part of unit testing
jest.mock('../../../../components/drawer/Right/DrawerContent', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/drawer/Right/DrawerContent'),
  default: props => (
    <>
      <div>Mock Drawer Content</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking InstallationGuideIcon as part of unit testing
jest.mock('../../../../components/icons/InstallationGuideIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/InstallationGuideIcon'),
  default: props => (
    <>
      <div>Mock InstallationGuideIcon</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking CeligoLinkAppLogo as part of unit testing
jest.mock('../../../../components/CeligoLinkAppLogo', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/CeligoLinkAppLogo'),
  default: props => (
    <>
      <div>Mock CeligoLinkAppLogo</div>
      <div>application = {props.application}</div>
    </>
  ),
}));

// Mocking RadioGroup as part of unit testing
jest.mock('../../../../components/DynaForm/fields/radiogroup/DynaQueryRadioGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm/fields/radiogroup/DynaQueryRadioGroup'),
  default: props => (
    <>
      <div>Mock Radio group</div>
      <div>value = {props.value}</div>
      <div>id = {props.id}</div>
      <div>defaultValue = {props.defaultValue}</div>
      <div>isValid = {props.isValid}</div>
      <button type="button" onClick={props.value === 'new' ? () => props.onFieldChange(undefined, 'existing') : () => props.onFieldChange(undefined, 'new')}>onFieldChange</button>
      <div>options = {JSON.stringify(props.options)}</div>
    </>
  ),
}));

// Mocking DynaForm as part of unit testing
jest.mock('../../../../components/DynaForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm'),
  default: props => (
    <>
      <div>Mock DynaForm</div>
      <div>formKey = {props.formKey}</div>
    </>
  ),
}));

// Mocking SaveAndCloseMiniResourceForm as part of unit testing
jest.mock('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm'),
  default: props => (
    <>
      <div>Mock SaveAndCloseMiniResourceForm</div>
      <div>formKey = {props.formKey}</div>
      <button
        type="button"
        onClick={props.handleSave}
      >
        {props.submitButtonLabel}
      </button>
      <div>formSaveStatus = {props.formSaveStatus}</div>
      <div>shouldNotShowCancelButton = {props.shouldNotShowCancelButton}</div>
    </>
  ),
}));

// Mocking connection MetaData as part of unit testing
jest.mock('./metadata/connection', () => ({
  __esModule: true,
  ...jest.requireActual('./metadata/connection'),
  default: {
    getMetaData: () => ({
      optionsHandler: () => mockOptionsHandler,
      patchSet: () => mockPatchSet,
    }),
  },
}));

// Mocking useHandleSubmit as part of unit testing
jest.mock('../../../../components/ResourceFormFactory/Actions/Groups/hooks/useHandleSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/ResourceFormFactory/Actions/Groups/hooks/useHandleSubmit'),
  default: props => mockUseHandleSubmit(props),
}));

// Mocking react-router-dom as part of unit testing
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe('Testsuite for AddOrSelectForm', () => {
  let useDispatchFn;
  let mockDispatchFn;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchFn = jest.spyOn(ReactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(
      action => {
        switch (action.type) {
          default:
        }
      }
    );
    useDispatchFn.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchFn.mockClear();
    mockDispatchFn.mockClear();
    mockOptionsHandler.mockClear();
    mockHistoryReplace.mockClear();
    mockPatchSet.mockClear();
    mockUseHandleSubmit.mockClear();
  });
  test('should test the form header', async () => {
    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: true,
      helpURL: '/test',
      urlExtenstionData: {pathname: '/test'},
    });
    expect(screen.getByText(/mock form header/i)).toBeInTheDocument();
    expect(screen.getByText(/selectedaccounthassandbox =/i)).toBeInTheDocument();
    expect(screen.getByText(/helpurl = \/test/i)).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', {
        name: /handletoggle/i,
      })
    );
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('12345', mockPatchSet, 'value'));
  });
  test('should test the Drawer Content when the selectedAccountHasSandbox has set to true and useNew is true', () => {
    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: true,
      helpURL: '/test',
      urlExtenstionData: {pathname: '/test'},
    });
    expect(screen.getByText(/mock drawer content/i)).toBeInTheDocument();
    expect(screen.getByText(/mock installationguideicon/i)).toBeInTheDocument();
    expect(screen.getByRole('link', {
      name: /shopify connection guide/i,
    })).toHaveAttribute('href', '/test');
    expect(screen.getByText(/mock celigolinkapplogo/i)).toBeInTheDocument();
    expect(screen.getByText(/application = shopify/i)).toBeInTheDocument();
    expect(screen.getByText(/mock radio group/i)).toBeInTheDocument();
    expect(screen.getByText('value = new')).toBeInTheDocument();
    expect(screen.getByText(/id = selecttype/i)).toBeInTheDocument();
    expect(screen.getByText(/defaultvalue = new/i)).toBeInTheDocument();
    expect(screen.getByText(/isvalid =/i)).toBeInTheDocument();
    expect(screen.getByText(
      /options = \[\{"items":\[\{"label":"set up new connection","value":"new"\},\{"label":"use existing connection","value":"existing"\}\]\}\]/i
    )).toBeInTheDocument();
    expect(screen.getByText(/mock dynaform/i)).toBeInTheDocument();
  });
  test('should test the radio button by changing it to existing connection', async () => {
    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: true,
      helpURL: '/test',
      urlExtenstionData: {pathname: '/test'},
    });
    expect(screen.getByText(/mock radio group/i)).toBeInTheDocument();
    expect(screen.getByText('value = new')).toBeInTheDocument();
    const radioButtonNode = screen.getByRole('button', {
      name: /onfieldchange/i,
    });

    expect(radioButtonNode).toBeInTheDocument();
    await userEvent.click(radioButtonNode);
    expect(screen.getByText('value = existing')).toBeInTheDocument();
  });
  test('should test the connection guide when the selectedAccountHasSandbox set to false', () => {
    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: false,
      helpURL: '/test',
      urlExtenstionData: {pathname: '/test'},
    });
    expect(screen.queryByText(/mock installationguideicon/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {
      name: /shopify connection guide/i,
    })).not.toBeInTheDocument();
  });
  test('should test the save and close mini resource form by clicking on save button', async () => {
    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: false,
      helpURL: '/test',
      urlExtenstionData: {pathname: '/test'},
    });
    expect(screen.getByText(/mock saveandcloseminiresourceform/i)).toBeInTheDocument();
    expect(screen.getByText(/formsavestatus =/i)).toBeInTheDocument();
    expect(screen.getByText(/shouldnotshowcancelbutton =/i)).toBeInTheDocument();
    const saveAndAuthorizeButtonNode = screen.getByRole('button', {
      name: /save & authorize/i,
    });

    expect(saveAndAuthorizeButtonNode).toBeInTheDocument();
    await userEvent.click(saveAndAuthorizeButtonNode);
    expect(mockUseHandleSubmit).toHaveBeenCalledWith({formKey: 'connections-12345', parentContext: {queryParams: ['code=null']}, resourceId: '12345', resourceType: 'connections'});
  });
  test('should test the redirect url when the form save is set to complete and type is not equal to IA', () => {
    const location = {
      pathname: '/',
      search: '?shop=shopData&type=typeData&code=codeData&clientId=clientIdData',
      state: { from: '/previous-path' },
    };

    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: false,
      helpURL: '/test',
      formData: {
        'connections-12345': {
          parentContext: {},
          disabled: false,
          showValidationBeforeTouched: false,
          conditionalUpdate: false,
          remountKey: 1,
          formIsDisabled: false,
          resetTouchedState: false,
          fields: {
            resourceId: {
              id: 'resourceId',
              name: '/resourceId',
              type: 'shopifyconnectionselect',
              placeholder: 'Select',
              resourceType: 'connections',
              required: true,
              label: 'Connection',
              options: {
                filter: {
                  $and: [
                    {
                      $or: [
                        {
                          type: 'rest',
                        },
                        {
                          type: 'http',
                        },
                      ],
                    },
                    {
                      _connectorId: {
                        $exists: false,
                      },
                    },
                    {
                      assistant: 'shopify',
                    },
                  ],
                },
                appType: 'shopify',
              },
              isValueValid: true,
              defaultValue: '',
              appTypeIsStatic: true,
              removeHelperText: true,
              visible: true,
              defaultVisible: true,
              defaultRequired: true,
              value: '61ae1dce782aab51339b59cb',
              touched: true,
              disabled: false,
              isValid: true,
              isDiscretelyInvalid: false,
              errorMessages: '',
            },
            _integrationId: {
              id: '_integrationId',
              value: 'someValue',
              name: '/resourceId',
            },
          },
          value: {
            '/resourceId': '61ae1dce782aab51339b59cb',
            '/http/unencrypted/version': '2022-10',
            '/http/auth/type': 'oauth',
            '/_integrationId': 'someValue',
          },
          isValid: true,
          lastFieldUpdated: 'resourceId',
        },
      },
      asyncTaskData: {
        'integrations/someValue/connections-12345': {
          status: 'complete',
        },
      },
      urlExtenstionData: location,
    });
    expect(screen.getByText(/mock saveandcloseminiresourceform/i)).toBeInTheDocument();
    expect(mockHistoryReplace).toHaveBeenCalledWith('/connections');
  });
  test('should test the redirect url when the form save is set to complete and type is equal to IA', () => {
    const location = {
      pathname: '/',
      search: '?shop=shopData&type=IA&code=codeData&clientId=clientIdData',
      state: { from: '/previous-path' },
    };

    initAddOrSelectForm({
      resourceId: '12345',
      selectedAccountHasSandbox: false,
      helpURL: '/test',
      formData: {
        'connections-12345': {
          parentContext: {},
          disabled: false,
          showValidationBeforeTouched: false,
          conditionalUpdate: false,
          remountKey: 1,
          formIsDisabled: false,
          resetTouchedState: false,
          fields: {
            resourceId: {
              id: 'resourceId',
              name: '/resourceId',
              type: 'shopifyconnectionselect',
              placeholder: 'Select',
              resourceType: 'connections',
              required: true,
              label: 'Connection',
              options: {
                filter: {
                  $and: [
                    {
                      $or: [
                        {
                          type: 'rest',
                        },
                        {
                          type: 'http',
                        },
                      ],
                    },
                    {
                      _connectorId: {
                        $exists: false,
                      },
                    },
                    {
                      assistant: 'shopify',
                    },
                  ],
                },
                appType: 'shopify',
              },
              isValueValid: true,
              defaultValue: '',
              appTypeIsStatic: true,
              removeHelperText: true,
              visible: true,
              defaultVisible: true,
              defaultRequired: true,
              value: '61ae1dce782aab51339b59cb',
              touched: true,
              disabled: false,
              isValid: true,
              isDiscretelyInvalid: false,
              errorMessages: '',
            },
            _integrationId: {
              id: '_integrationId',
              value: 'someValue',
              name: '/resourceId',
            },
          },
          value: {
            '/resourceId': '61ae1dce782aab51339b59cb',
            '/http/unencrypted/version': '2022-10',
            '/http/auth/type': 'oauth',
            '/_integrationId': 'someValue',
          },
          isValid: true,
          lastFieldUpdated: 'resourceId',
        },
      },
      asyncTaskData: {
        'integrations/someValue/connections-12345': {
          status: 'complete',
        },
      },
      connectionData: [
        {
          _id: '12345',
          name: 'Test Connection Name',
          _integrationId: 'someValue',
        },
      ],
      urlExtenstionData: location,
    });
    expect(screen.getByText(/mock saveandcloseminiresourceform/i)).toBeInTheDocument();
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrationapps/integrationApp/someValue');
  });
});


import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import SalesforceMappingAssistant from '.';
import { getCreatedStore } from '../../store';
import actions from '../../actions';

const LAYOUT = {
  editLayoutSections: [
    {
      columns: 2,
      heading: 'Contact Information',
      layoutRows: [
        {
          layoutItems: [
            {
              label: 'Contact Owner',
              layoutComponents: [
                {
                  details: {
                    label: 'Owner ID',
                    length: 18,
                    name: 'OwnerId',
                    picklistValues: [],
                    referenceTo: [
                      'User',
                    ],
                    relationshipName: 'Owner',
                    type: 'reference',
                  },
                  displayLines: 1,
                  tabOrder: 20,
                  type: 'Field',
                  value: 'OwnerId',
                },
              ],
            },
            {
              editableForNew: true,
              editableForUpdate: true,
              label: 'Phone',
              layoutComponents: [
                {
                  details: {
                    label: 'Business Phone',
                    length: 40,
                    name: 'Phone',
                    nillable: true,
                    permissionable: true,
                    picklistValues: [],
                    referenceTo: [],
                    type: 'boolean',
                  },
                  displayLines: 1,
                  tabOrder: 31,
                  type: 'Field',
                  value: 'Phone',
                },
              ],
            },
          ],
          numItems: 2,
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: 'Name',
              layoutComponents: [
                {
                  components: [
                    {
                      details: {
                        compoundFieldName: 'Name',
                        extraTypeInfo: 'personname',
                        label: 'Salutation',
                        length: 40,
                        name: 'Salutation',
                        nillable: true,
                        picklistValues: [
                          {
                            active: true,
                            label: 'Mr.',
                            value: 'Mr.',
                          },
                          {
                            active: true,
                            label: 'Ms.',
                            value: 'Ms.',
                          },
                        ],
                        referenceTo: [],
                        type: 'picklist',
                      },
                      displayLines: 1,
                      tabOrder: 22,
                      type: 'Field',
                      value: 'Salutation',
                    },
                  ],
                  details: {
                    extraTypeInfo: 'personname',
                    label: 'Full Name',
                    length: 121,
                    name: 'Name',
                    nameField: true,
                    picklistValues: [],
                    referenceTo: [],
                    type: 'string',
                  },
                  displayLines: 1,
                  fieldType: 'string',
                  tabOrder: 21,
                  type: 'Field',
                  value: 'Name',
                },
              ],
              required: true,
            },
          ],
          numItems: 1,
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: 'Account Name',
              layoutComponents: [
                {
                  details: {
                    label: 'Account ID',
                    length: 260,
                    name: 'AccountId',
                    nillable: true,
                    permissionable: true,
                    picklistValues: [],
                    referenceTo: [
                      'Account',
                    ],
                    relationshipName: 'Account',
                    searchPrefilterable: true,
                    type: 'textarea',
                  },
                  displayLines: 1,
                  tabOrder: 25,
                  type: 'Field',
                  value: 'AccountId',
                },
              ],
            },
          ],
          numItems: 1,
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: 'Birthdate',
              layoutComponents: [
                {
                  details: {
                    label: 'Birthdate',
                    name: 'Birthdate',
                    nillable: true,
                    permissionable: true,
                    picklistValues: [],
                    referenceTo: [],
                    type: 'date',
                  },
                  displayLines: 1,
                  tabOrder: 28,
                  type: 'Field',
                  value: 'Birthdate',
                },
              ],
            },
          ],
          numItems: 1,
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: 'Reports To',
              layoutComponents: [
                {
                  details: {
                    label: 'Reports To ID',
                    length: 18,
                    name: 'ReportsToId',
                    nillable: true,
                    permissionable: true,
                    picklistValues: [],
                    referenceTo: [
                      'User',
                    ],
                    relationshipName: 'ReportsTo',
                    searchPrefilterable: true,
                    type: 'textarea',
                  },
                  isAddressField: true,
                  displayLines: 1,
                  tabOrder: 29,
                  type: 'Field',
                  value: 'ReportsToId',
                },
              ],
            },
          ],
          numItems: 1,
        },
        {
          layoutItems: [
            {
              editableForNew: true,
              editableForUpdate: true,
              label: 'Asst. Phone',
              layoutComponents: [
                {
                  details: {
                    label: 'Asst. Phone',
                    length: 40,
                    name: 'AssistantPhone',
                    nillable: true,
                    permissionable: true,
                    picklistValues: [],
                    referenceTo: [],
                    type: 'phone',
                  },
                  displayLines: 1,
                  tabOrder: 38,
                  type: 'Field',
                  value: 'AssistantPhone',
                },
              ],
            },
          ],
          numItems: 1,
        },
      ],
      layoutSectionId: '01BB0000008lFEKMA2',
      parentLayoutId: '00hB0000002J04rIAC',
      rows: 8,
      tabOrder: 'TopToBottom',
      useHeading: true,
    },
    {
      columns: 2,
      heading: 'System Information',
      layoutSectionId: '01BB0000008lFEMMA2',
      useHeading: true,
    },
  ],
};

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (<div>Spinner</div>),
}));

jest.mock('react-frame-component', () => ({
  __esModule: true,
  ...jest.requireActual('react-frame-component'),
  default: props => (<div data-testid={props['data-test']}>{props.children}</div>),
}));

async function initSalesforceMappingAssistant(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <SalesforceMappingAssistant {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for SalesforceMappingAssistant', () => {
  let useDispatchSpy;
  let mockDispatchFn;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass initial rendering', async () => {
    const sObjectType = 'Salesforce';

    await initSalesforceMappingAssistant({sObjectType});
    expect(screen.getByText(`${sObjectType} is a non-layoutable entity.`)).toBeInTheDocument();
  });

  test('should render only a spinner if status is requested', async () => {
    const connectionId = '123abc';
    const sObjectType = 'Salesforce';
    const layoutId = '456def';
    const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${layoutId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[connectionId] = {};
      draft.session.metadata.application[connectionId][commMetaPath] = {
        status: 'requested',
        data: [{
          name: 'asd',
          scriptId: 'xyz',
          url: 'https:://sampleURL.com',
        }],
      };
    });

    await initSalesforceMappingAssistant({connectionId, sObjectType, layoutId}, initialStore);
    expect(screen.getByText('Spinner')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request(
      connectionId, commMetaPath
    ));
  });

  test('should be able to render the mapping assistant form', async () => {
    const onFieldClick = jest.fn();
    const connectionId = '123abc';
    const sObjectType = 'Contact';
    const layoutId = '456def';
    const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${layoutId}`;
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[connectionId] = {};
      draft.session.metadata.application[connectionId][commMetaPath] = {
        status: 'complete',
        data: LAYOUT,
      };
    });

    await initSalesforceMappingAssistant({connectionId, sObjectType, layoutId, onFieldClick}, initialStore);

    expect(screen.getByTestId('salesforceMappingAssistant')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: `New ${sObjectType} --- Click in a field below to select ---`})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Contact Information'})).toBeInTheDocument();
    expect(screen.queryByRole('heading', {name: 'System Information'})).not.toBeInTheDocument();

    const inputField = screen.getAllByRole('textbox')[0];

    expect(onFieldClick).not.toHaveBeenCalled();
    await userEvent.click(inputField);
    expect(onFieldClick).toHaveBeenCalledTimes(1);
  });
});


import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import actions from '../../../../../actions';
import SubRecordDrawer from './index';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';

const initialStore = getCreatedStore();

jest.mock('../../../../../hooks/useEnableButtonOnTouchedForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../hooks/useEnableButtonOnTouchedForm'),
  default: props => ({formTouched: true, onClickWhenValid: props.onClick}),
}));

jest.mock('../../../DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../DynaSubmit'),
  default: props => {
    const formValues = {
      fieldId: 'item[*].celigo_inventorydetail',
      jsonPath_item_sublist_celigo_inventorydetail: '$',
    };

    return <button type="button" onClick={() => props.onClick(formValues)} >Save</button>;
  },
}));

const mockHistoryGoback = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoback,
  }),
}));

jest.mock('./util', () => ({
  __esModule: true,
  ...jest.requireActual('./util'),
  default: () => {
    const fieldMeta = {
      fieldMap: {
        fieldId: {
          id: 'fieldId',
          name: 'fieldId',
          helpKey: 'dynaFormField.subrecord',
          type: 'select',
          label: 'Which Sales Order field should this subrecord set?',
          options: [
            {
              items: [
                {
                  id: 'item[*].celigo_inventorydetail',
                  name: 'Items : Inventory Details',
                  subRecordType: 'inventorydetail',
                  value: 'item[*].celigo_inventorydetail',
                  label: 'Items : Inventory Details',
                  subRecordJsonPathLabel: 'Path to node that contains items data',
                },
              ],
            },
          ],
          defaultDisabled: false,
          required: true,
          isLoggable: true,
        },
        jsonPath_item_sublist_celigo_inventorydetail: {
          id: 'jsonPath_item_sublist_celigo_inventorydetail',
          name: 'jsonPath_item_sublist_celigo_inventorydetail',
          helpKey: 'dynaFormField.pathToNode',
          isLoggable: true,
          type: 'netsuitesubrecordjsonpath',
          label: 'Path to node that contains items data',
          visibleWhen: [
            {
              field: 'fieldId',
              is: [
                'item[*].celigo_inventorydetail',
              ],
            },
          ],
          requiredWhen: [
            {
              field: 'fieldId',
              is: [
                'item[*].celigo_inventorydetail',
              ],
            },
          ],
          resourceId: '63887c8a37ba6127acd9f400',
        },
      },
      layout: {
        fields: [
          'fieldId',
          'jsonPath_item_sublist_celigo_inventorydetail',
        ],
      },
    };

    return fieldMeta;
  },
}));

function initSubRecordDrawer(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'netsuite/metadata/suitescript/connections/5efd8663a56953365bd28541/recordTypes': {
        data: [{
          name: 'test',
          scriptId: 'customer',
          url: 'test url',
          value: 'customer',
          hasSubRecord: props.hasRecord,
          subRecordConfig: [{id: 'item[*].celigo_inventorydetail', name: 'test name'}],
          doesNotSupportUpdate: true,
          doesNotSupportCreate: true,
          doesNotSupportSearch: true,
          doesNotSupportDelete: true,
        }],
        status: 'success',
        errorMessage: 'Test Error Message',
      },
    },

    }};
    draft.data.resources = {
      imports: [{
        _id: '633dc83108cc753ca5688d34',
        createdAt: '2022-10-05T18:08:49.284Z',
        lastModified: '2022-10-05T18:09:48.433Z',
        name: 'NETSUITE IMPORT',
        _connectionId: '62f4e3b40f2ee6482b133e00',
        distributed: true,
        apiIdentifier: 'i819b78e2a',
        ignoreExisting: false,
        ignoreMissing: false,
        oneToMany: false,
        lookups: [],
        netsuite_da: {
          useSS2Restlets: false,
          operation: 'addupdate',
          recordType: 'customer',
          subrecords: [{fieldId: 'fieldId1', name: 'subrecord1'}, {fieldId: 'fieldId2', name: 'subrecord2'}],
          internalIdLookup: {
            expression: '["email","is","{{{email}}}"]',
          },
          lookups: [],
          mapping: {
            fields: [
              {
                generate: 'isperson',
                discardIfEmpty: false,
                immutable: false,
                hardCodedValue: 'true',
                internalId: false,
              },
            ],
            lists: [
              {
                generate: 'addressbook',
                fields: [
                  {
                    generate: 'addr1',
                    extract: 'addresses[*].address1',
                    internalId: false,
                  },
                ],
              },
            ],
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      }, {
        _id: '633dc83108cc753ca5688d45',
        name: 'import1',
        _connectionId: '533dc83108cc753ca5688d45',
      }],
    };
  });

  return renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: '/imports/edit/imports/61fa113a69aaa8558e083607/subrecords'}]}>
      <Route path="/imports/edit/imports/61fa113a69aaa8558e083607">
        <ConfirmDialogProvider>
          <SubRecordDrawer {...props} />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>, {initialStore});
}

describe('subRecordDrawer UI tests', () => {
  const props = {
    resourceContext: {
      resourceId: '633dc83108cc753ca5688d34',
      recordType: 'customer',
    },
    connectionId: '5efd8663a56953365bd28541',
    flowId: '6efd8663a56953365bd28541',
    recordType: 'customer',
  };

  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render', () => {
    initSubRecordDrawer(props);
    expect(screen.getByText('Add subrecord import')).toBeInTheDocument();
    expect(screen.getByText('Which Sales Order field should this subrecord set?')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on the save button', async () => {
    const updatedSubrecords = [
      { fieldId: 'fieldId1', name: 'subrecord1' },
      { fieldId: 'fieldId2', name: 'subrecord2' },
      {
        fieldId: 'item[*].celigo_inventorydetail',
        jsonPath: '$',
        recordType: undefined,
      },
    ];

    initSubRecordDrawer(props);
    expect(screen.getByText('Save')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged(
      '633dc83108cc753ca5688d34',
      [
        {
          op: 'replace',
          path: '/netsuite_da/subrecords',
          value: updatedSubrecords,
        },
      ],
    )));
  });
  test('should make a url redirection when clicked on save button', async () => {
    initSubRecordDrawer(props);
    expect(screen.getByText('Save')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockHistoryGoback).toHaveBeenCalled());
  });
  test('should make a url redirection when clicked on cancel button', async () => {
    initSubRecordDrawer(props);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Cancel'));
    await waitFor(() => expect(mockHistoryGoback).toHaveBeenCalled());
  });
});

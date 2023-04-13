import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import actions from '../../../../actions';
import DynaNetSuiteSubRecords from './index';
import { mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';

let initialStore = getCreatedStore();
const mockOnFieldChange = jest.fn();
const props = {
  resourceContext: {
    resourceId: '633dc83108cc753ca5688d34',
    recordType: 'customer',
  },
  connectionId: '5efd8663a56953365bd28541',
  onFieldChange: mockOnFieldChange,
  id: 'demoId',
  options: {
    recordType: 'customer',
  },
  defaultValue: 'default value',
  value: [],
  formKey: 'form-123',
  flowId: '5efd8663a56953365bd28542',
  hasRecord: true,
  subrecords: [{fieldId: 'fieldId1', name: 'subrecord1'}, {fieldId: 'fieldId2', name: 'subrecord2'}],
};

function initDynaNetSuiteSubRecords(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'netsuite/metadata/suitescript/connections/5efd8663a56953365bd28541/recordTypes': {
        data: [{
          name: 'test',
          scriptId: 'customer',
          url: 'test url',
          value: 'customer',
          hasSubRecord: props.hasRecord,
          subRecordConfig: [],
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
          subrecords: props.subrecords,
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
              {
                generate: 'firstname',
                extract: 'first_name',
                internalId: false,
              },
              {
                generate: 'lastname',
                extract: 'last_name',
                internalId: false,
              },
              {
                generate: 'phone',
                extract: 'phone',
                internalId: false,
              },
              {
                generate: 'mobilephone',
                extract: 'phone',
                internalId: false,
              },
              {
                generate: 'email',
                extract: 'email',
                internalId: false,
              },
              {
                generate: 'companyname',
                extract: 'addresses[*].company',
                internalId: false,
              },
              {
                generate: 'celigo_replaceAllLines_addressbook',
                discardIfEmpty: false,
                immutable: false,
                hardCodedValue: 'true',
                internalId: false,
              },
              {
                generate: 'subsidiary',
                discardIfEmpty: false,
                immutable: false,
                hardCodedValue: '4',
                internalId: true,
              },
              {
                generate: 'entityid',
                extract: 'id',
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
                  {
                    generate: 'addr2',
                    extract: 'addresses[*].address2',
                    internalId: false,
                  },
                  {
                    generate: 'state',
                    extract: 'addresses[*].province',
                    internalId: false,
                  },
                  {
                    generate: 'country',
                    extract: 'addresses[*].country_code',
                    internalId: true,
                  },
                  {
                    generate: 'addrphone',
                    extract: 'addresses[*].phone',
                    internalId: false,
                  },
                  {
                    generate: 'zip',
                    extract: 'addresses[*].zip',
                    internalId: false,
                  },
                  {
                    generate: 'addressee',
                    extract: 'addresses[*].name',
                    internalId: false,
                  },
                  {
                    generate: 'city',
                    extract: 'addresses[*].city',
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
          <DynaNetSuiteSubRecords {...props} />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>, {initialStore});
}

jest.mock('../../../../utils/resource', () => ({
  ...jest.requireActual('../../../../utils/resource'),
  getNetSuiteSubrecordImports: () => ([{value: 'value'}]),
}));

describe('dynaNetSuiteSubRecords UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    initialStore = getCreatedStore();
    mockOnFieldChange.mockClear();
  });

  test('should pass the initial render', () => {
    initDynaNetSuiteSubRecords({...props, subrecords: undefined});
    expect(screen.getByText('Subrecord imports')).toBeInTheDocument();
    expect(screen.getByText('Add subrecord')).toBeInTheDocument();
    expect(screen.getByText('Add subrecord import')).toBeInTheDocument();
  });
  test('should make a dipatch call on initial render when subrecords are absent', async () => {
    const patchSet = [];

    patchSet.push({
      op: 'add',
      path: '/netsuite_da/subrecords',
      value: [{value: 'value'}],
    });
    initDynaNetSuiteSubRecords({...props, subrecords: undefined});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('633dc83108cc753ca5688d34', patchSet)));
  });
  test('should make a dispatch call with different patchset when importdoc does not contain netsuite_da', async () => {
    const patchSet = [];

    patchSet.push({
      op: 'add',
      path: '/netsuite_da',
      value: {},
    });
    patchSet.push({
      op: 'add',
      path: '/netsuite_da/subrecords',
      value: [],
    });
    initDynaNetSuiteSubRecords({resourceContext: {resourceId: '633dc83108cc753ca5688d45', recordType: 'dummy'}, hasRecord: true, onFieldChange: mockOnFieldChange});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged('633dc83108cc753ca5688d45', patchSet)));
  });
  test('should display the subrecords if the importDoc already has some of them added', async () => {
    initDynaNetSuiteSubRecords({...props});
    expect(screen.getByText('fieldId1')).toBeInTheDocument();
    expect(screen.getByText('fieldId2')).toBeInTheDocument();
  });
  test('shoud display the confirm dialogue when we attempt to delete a subrecord', async () => {
    initDynaNetSuiteSubRecords({...props});
    const deleteButton = document.querySelector('button[data-test="delete-subrecord"]');

    await userEvent.click(deleteButton);
    expect(screen.getByText('Confirm remove')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to remove this subrecord import?')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
  test('should make a dispatch call with updated subrecord list when a subrecord is deleted', async () => {
    initDynaNetSuiteSubRecords({...props});
    const deleteButton = document.querySelector('button[data-test="delete-subrecord"]');

    await userEvent.click(deleteButton);
    expect(screen.getByText('Remove')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Remove'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged(
      '633dc83108cc753ca5688d34',
      [
        {
          op: 'replace',
          path: '/netsuite_da/subrecords',
          value: [{fieldId: 'fieldId2', name: 'subrecord2'}],
        },
      ],
    )));
  });
  test('should render empty DOM when the metadata does not have subrecords', () => {
    const {utils} = initDynaNetSuiteSubRecords({...props, hasRecord: false});

    expect(utils.container).toBeEmptyDOMElement();
  });
});

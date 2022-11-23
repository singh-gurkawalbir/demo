/* global describe, expect, jest, test, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import DynaNetSuiteRecordType from './DynaNetSuiteRecordType';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('./DynaRefreshableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaRefreshableSelect'),
  default: () => (<div>DynaRefreshableSelect</div>),
}));

describe("test suite for 'Record type' field in Netsuite", () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should remove the subrecords patch when record type is changed', () => {
    const props = {
      resourceId: 'import123',
      resourceType: 'imports',
      label: 'Record type',
      type: 'netsuiterecordtype',
      fieldId: 'netsuite_da.recordType',
      id: 'netsuite_da.recordType',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.imports = [{
      _id: 'import123',
      name: 'NS import',
      netsuite_da: {
        operation: 'add',
        recordType: 'customer',
      },
      adaptorType: 'NetSuiteDistributedImport',
    }];

    renderWithProviders(<DynaNetSuiteRecordType {...props} />, {initialStore});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchStaged(props.resourceId, [
      {
        op: 'remove',
        path: '/netsuite_da/subrecords',
      },
    ], 'value'));
    expect(screen.getByText('DynaRefreshableSelect')).toBeInTheDocument();
  });

  test("should not attempt to clear subrecords if doesn't exist", () => {
    const props = {
      resourceId: 'import123',
      resourceType: 'imports',
      label: 'Record type',
      type: 'netsuiterecordtype',
      fieldId: 'netsuite_da.recordType',
      id: 'netsuite_da.recordType',
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.imports = [{
      _id: 'import123',
      name: 'NS import',
      adaptorType: 'NetSuiteDistributedImport',
    }];

    renderWithProviders(<DynaNetSuiteRecordType {...props} />, {initialStore});
    expect(mockDispatchFn).not.toHaveBeenCalled();
    expect(screen.getByText('DynaRefreshableSelect')).toBeInTheDocument();
  });
});

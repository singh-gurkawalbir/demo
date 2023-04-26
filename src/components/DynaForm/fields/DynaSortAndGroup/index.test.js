/* eslint-disable import/named */

import React from 'react';
import * as reactRedux from 'react-redux';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../test/test-utils';
import DynaSortAndGroup from './index';
import actions from '../../../../actions';

const resourceId = 'export-id';
const formKey = 'form-key';
const value = ['selectedValue'];
const enableSorting = true;
const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.resourceFormSampleData = {
    'export-id': {
      typeOfSampleData: 'preview',
      preview: {
        data: {
          parse: [{
            id: 'userID',
            name: 'user name',
            randomString: 'randomValue',
            randomObject: {
              key: 'value',
            },
            boolean: true,
          }]},
      },
      status: 'received',
    },
    'export-id-2': {
      typeOfSampleData: 'preview',
      status: undefined,
    },
  };
});

describe('uI test cases for DynaSortAndGroup', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  const initialStore = reduxStore;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'RESOURCE_FORM_SAMPLE_DATA_REQUEST':
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should display the options in the select component for a export which is not of type http or rdbms', async () => {
    renderWithProviders(<DynaSortAndGroup resourceId={resourceId} formKey={formKey} />, {initialStore});
    await userEvent.click(screen.queryByText(/Select.../i));
    await waitFor(() => expect(screen.queryByText(/randomString/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/randomObject/i)).toBeInTheDocument());
  });
  test('should display the options in the select component for a http, rdbms and file type export', async () => {
    renderWithProviders(<DynaSortAndGroup resourceId={resourceId} formKey={formKey} resourceSubType="http" />, {initialStore});
    await userEvent.click(screen.queryByText(/Select.../i));
    await waitFor(() => expect(screen.queryByText(/randomString/i)).toBeInTheDocument());
  });
  test('should not display the object in the select component as options for a http or rdbms type export', async () => {
    renderWithProviders(<DynaSortAndGroup resourceId={resourceId} formKey={formKey} value={value} resourceSubType="rdbms" />, {initialStore});
    expect(screen.queryByText(/selectedValue/i)).toBeInTheDocument();
    await userEvent.click(screen.queryByText(/selectedValue/i));
    await waitFor(() => expect(screen.queryByText(/randomString/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/randomObject/i)).not.toBeInTheDocument());
  });
  test('should display the object in the select component as options for a file type export', async () => {
    renderWithProviders(<DynaSortAndGroup resourceId={resourceId} formKey={formKey} value={value} />, {initialStore});
    expect(screen.queryByText(/selectedValue/i)).toBeInTheDocument();
    await userEvent.click(screen.queryByText(/selectedValue/i));
    await waitFor(() => expect(screen.queryByText(/randomString/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/randomObject/i)).toBeInTheDocument());
  });
  test('should dispatch resourceFormSampleData request if the export has no sampleData', () => {
    renderWithProviders(<DynaSortAndGroup resourceId="export-id-2" formKey={formKey} />, {initialStore});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceFormSampleData.request(formKey));
  });
  test('should display DynaSelectMultiApplication if enableSorting prop is falsy', () => {
    jest.mock('../DynaSelectMultiApplication', () => ({
      __esModule: true,
      ...jest.requireActual('../DynaSelectMultiApplication'),
      default: () => (
        <>
          <p>DynaSelectMultiApplication</p>
        </>
      ),
    }));

    renderWithProviders(<DynaSortAndGroup resourceId={resourceId} formKey={formKey} />, {initialStore});
    waitFor(() => expect(screen.queryByText(/DynaSelectMultiApplication/i)).toBeInTheDocument());
  });
  test('should display DynaKeyValue if enableSorting prop is truthy', () => {
    jest.mock('../DynaKeyValue', () => ({
      __esModule: true,
      ...jest.requireActual('../DynaKeyValue'),
      default: () => (
        <>
          <p>DynaKeyValue</p>
        </>
      ),
    }));

    renderWithProviders(<DynaSortAndGroup resourceId={resourceId} formKey={formKey} enableSorting={enableSorting} />, {initialStore});
    waitFor(() => expect(screen.queryByText(/DynaKeyValue/i)).toBeInTheDocument());
  });
});

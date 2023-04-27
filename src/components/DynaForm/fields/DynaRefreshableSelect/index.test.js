import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import actions from '../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaSelectOptionsGenerator from './index';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaSelectOptionsGenerator(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: props.data,
        status: 'success',
        errorMessage: 'Test Error Message',
      },
    },
    }};
    draft.data.resources = {
      connections: [{
        _id: '5efd8663a56953365bd28541',
        offline: props.offline,
      }],
    };
  });

  return renderWithProviders(<DynaSelectOptionsGenerator {...props} />, {initialStore});
}

describe('dynaSelectOptionsGenerator UI tests', () => {
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

  const mockonFieldChange = jest.fn();
  const props = {
    connectionId: '5efd8663a56953365bd28541',
    commMetaPath: 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
    filterKey: 'salesforce-sObject-layout',
    fieldData: [],
    data: [{searchLayoutable: true}],
    bundleUrlHelp: 'test url',
    bundlePath: 'test path',
    onFieldChange: mockonFieldChange,
    disableFetch: false,
    ignoreValidation: false,
  };

  test('should pass the initial render', () => {
    initDynaSelectOptionsGenerator(props);
    const dropdown = document.querySelector('input');

    expect(dropdown).toBeInTheDocument();
  });
  test('should display the html error message when ignoreValidation prop is false', () => {
    initDynaSelectOptionsGenerator(props);
    expect(screen.getByText('Test Error Message')).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on refresh', async () => {
    initDynaSelectOptionsGenerator(props);
    const refreshButton = document.querySelector('[data-test="refreshResource"]');

    await userEvent.click(refreshButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.refresh(
      '5efd8663a56953365bd28541',
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
      {
        refreshCache: true,
        bundleUrlHelp: 'test url',
        bundlePath: 'test path',
      }
    )));
  });
  test('should not make a dispatch call on clicking refresh when disableFetch prop is true', async () => {
    initDynaSelectOptionsGenerator({...props, disableFetch: true});
    const refreshButton = document.querySelector('[data-test="refreshResource"]');

    await userEvent.click(refreshButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledTimes(0));
  });
  test('should make a dispatch call on initial render when data is undefined and disableFetch is false', async () => {
    initDynaSelectOptionsGenerator({...props, data: undefined, fieldData: undefined});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request(
      '5efd8663a56953365bd28541',
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
      { bundleUrlHelp: 'test url', bundlePath: 'test path' }
    )));
  });
});

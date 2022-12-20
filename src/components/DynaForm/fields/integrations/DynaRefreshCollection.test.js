/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import DynaRefreshCollection from './DynaRefreshCollection';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

function initDynaRefreshCollection(props = {}) {
  initialStore.getState().session.form = {
    formKey: {
      fields: {
        integration: {
          value: '5b3c75dd5d3c125c88b5dd20',
        },
      },
    },
  };

  return renderWithProviders(<DynaRefreshCollection {...props} />, {initialStore});
}

describe('DynaRefreshCollection UI tests', () => {
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
    initDynaRefreshCollection({resourceType: 'imports'});
    expect(screen.getByText('Please select')).toBeInTheDocument();
    const refreshButton = document.querySelector('[data-test="refreshResource"]');

    expect(refreshButton).toBeInTheDocument();
    screen.debug();
  });
  test('should make a dispatch call when clicked on refresh button', async () => {
    initDynaRefreshCollection({resourceType: 'imports'});
    const refreshButton = document.querySelector('[data-test="refreshResource"]');

    expect(refreshButton).toBeInTheDocument();
    userEvent.click(refreshButton);
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.resource.requestCollection('imports')));
  });
});

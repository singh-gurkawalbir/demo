/* global describe, test, beforeEach, expect, jest, afterEach */
import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import RefreshableHeading from '.';
import { renderWithProviders } from '../../../../test/test-utils';
import commKeyGen from '../../../../utils/commKeyGenerator';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';

let initialStore;

function initRefreshableHeading(label, resourceType, status) {
  initialStore.getState().comms.networkComms = {
    [commKeyGen(`/${resourceType}`, 'GET')]: {
      status,
    },
  };
  const ui = (
    <RefreshableHeading label={label} resourceType={resourceType} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for Refresable Heading', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
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
  test('should test the spinner when the refresh status is loading', async () => {
    initRefreshableHeading('test label', 'exports', 'loading');
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
    const refreshButtonNode = document.querySelector('button[data-test="refreshStatus"]');

    expect(refreshButtonNode).toBeInTheDocument();
    await userEvent.click(refreshButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('exports'));
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
  test('should test the refresh icon when the refresh status is success', async () => {
    initRefreshableHeading('test label', 'exports', 'success');
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
    const refreshButtonNode = document.querySelector('button[data-test="refreshStatus"]');

    expect(refreshButtonNode).toBeInTheDocument();
    await userEvent.click(refreshButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('exports'));
    expect(refreshButtonNode).toBeInTheDocument();
  });
});


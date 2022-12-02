/* global describe, test, expect,beforeEach, afterEach, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import DynaChangeLicenseEdition from './DynaChangeLicenseEdition';

describe('DynaChangeLicenseEdition tests', () => {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    connectors: [{
      _id: '_connectorId',
      twoDotZero: {
        editions: [
          {
            _id: '_editionId1',
            order: 3,
          },
          {
            _id: '_editionId2',
            order: 4,
          },
          {
            _id: '_editionId3',
            order: 5,
          },
        ]},
    }],
  };
  let mockDispatchFn;
  let useDispatchSpy;

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
  });

  test('Should able to test DynaChangeLicenseEdition with edition2', async () => {
    const props = {
      editionId: '_editionId2', connectorId: '_connectorId',
    };

    await renderWithProviders(<DynaChangeLicenseEdition {...props} />, {initialStore});
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    expect(screen.getByRole('menuitem', {name: '_editionId3'})).toBeInTheDocument();
  });
  test('Should able to test DynaChangeLicenseEdition with invalid connectorId', async () => {
    const props = {
      editionId: '_editionId1', connectorId: '_connectorId2',
    };

    await renderWithProviders(<DynaChangeLicenseEdition {...props} />, {initialStore});
    expect(screen.queryByRole('button', {name: 'Please select'})).not.toBeInTheDocument();
  });
});

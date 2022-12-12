/* global describe, test, expect,beforeEach,afterEach, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import DynaFieldExpressionSelect from './DynaFieldExpressionSelect';
import actions from '../../../actions';

describe('DynaFieldExpressionSelect tests', () => {
  const initialStore = reduxStore;

  initialStore.getState().session.editors = {
    helperFunctions: {
      abs: '{{abs field}}',
      timestamp: '{{timestamp format timezone}}',
    },
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
  test('Should able to test DynaFieldExpressionSelect ', async () => {
    await renderWithProviders(<DynaFieldExpressionSelect />, {initialStore});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.refreshHelperFunctions());
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    expect(screen.getByRole('menuitem', {name: 'Please select'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'abs'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'timestamp'})).toBeInTheDocument();
  });
});

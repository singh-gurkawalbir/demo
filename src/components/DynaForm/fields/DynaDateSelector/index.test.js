/* global describe, test, expect, jest, beforeEach, afterEach */
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import {renderWithProviders} from '../../../../test/test-utils';
import DynaDateSelector from './index';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaDateSelector(props = {}) {
  initialStore.getState().data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}]};
  initialStore.getState().user.preferences = {
    dateFormat: 'MM/DD/YYYY',
    ssConnectionIds: props.connections,
  };

  return renderWithProviders(<DynaDateSelector {...props} />, {initialStore});
}

jest.mock('../../../DateRangeSelector', () => ({
  __esModule: true,
  ...jest.requireActual('../../../DateRangeSelector'),
  default: props =>
    (
      <>
        <div>{props.children}</div>
        <button type="button" onClick={() => props.onSave}>Save</button>
      </>

    )
  ,
}));

describe('DynaDateSelector UI tests', () => {
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
    mockDispatchFn.mockClear();
  });
  const mockOnFieldChange = jest.fn();
  const props = {
    id: 'formId',
    required: true,
    formKey: 'demo-formkey',
    value: '2018-06-06T00:00:00.000Z',
    onFieldChange: mockOnFieldChange,
  };

  test('should pass the initial render', () => {
    initDynaDateSelector(props);
    const dateField = screen.getByPlaceholderText('MM/DD/YYYY');

    expect(dateField).toBeInTheDocument();
    expect(dateField).toHaveValue('06/06/2018');
  });
  test('should make a dispatch call when valid date is passed on initial render', async () => {
    initDynaDateSelector({...props, formKey: 'demo-formkey'});
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.form.forceFieldState('demo-formkey')('formId', {isValid: true})));
  });
  test('should make a dispatch call with error message when invalid date is passed on initial render', async () => {
    initDynaDateSelector({...props, value: '2018-06T0000.000Z'});
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.form.forceFieldState('demo-formkey')('formId', {isValid: false, errorMessages: 'Invalid date format'})));
  });
  test('should call the onChange function passed in props when field value is altered', () => {
    initDynaDateSelector({...props, formKey: 'demo-formkey'});
    const field = screen.getByRole('textbox');

    expect(field).toBeInTheDocument();
    userEvent.type(field, 'a');
    expect(mockOnFieldChange).toBeCalled();
  });
  test('should call the "handleDateRangeChange" function when date is changed', () => {
    initDynaDateSelector(props);
    const dateField = screen.getByPlaceholderText('MM/DD/YYYY');

    expect(dateField).toBeInTheDocument();
    userEvent.clear(dateField);
    userEvent.type(dateField, '06/06/2018');
    expect(mockOnFieldChange).toBeCalled();
  });
});

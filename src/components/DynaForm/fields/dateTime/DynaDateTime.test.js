/* eslint-disable jest/expect-expect */

import React from 'react';
import { fireEvent, screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import DynaDateTime from './DynaDateTime';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initDynaDateTime(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {integrations: [{_id: '5ff579d745ceef7dcd797c15', name: 'integration1'}, {_id: '5ff579d745ceef7dcd797c16', _connectorId: '6ff579d745ceef7dcd797c16', name: 'integration2'}]};
    draft.user.preferences = {
      dateFormat: 'MM/DD/YYYY',
      ssConnectionIds: props.connections,
    };
    draft.user.profile = {
      timezone: 'Asia/Calcutta',
      _connectorId: '6aa579d745ceef7dcd797c15',
    };
  });

  return renderWithProviders(<DynaDateTime {...props} />, {initialStore});
}

jest.mock('../../../icons/CalendarIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/CalendarIcon'),
  default: () =>
    (
      <button type="button">CalendarIcon</button>
    )
  ,
}));

jest.mock('@material-ui/icons/AccessTime', () => ({
  __esModule: true,
  ...jest.requireActual('@material-ui/icons/AccessTime'),
  default: () =>
    (
      <button type="button">AccessTimeIcon</button>
    )
  ,
}));

describe('dynaDateTime UI tests', () => {
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
  const mockOnFieldChangeFn = jest.fn();

  const props = {
    id: 'dateTime',
    label: 'formLabel',
    value: '2018-06-07T00:00:00.000Z',
    resourceContext: {
      resourceType: 'integrations',
      resourceId: '5ff579d745ceef7dcd797c15',
    },
    formKey: 'imports-5bf18b09294767270c62fad9',
    required: true,
    onFieldChange: mockOnFieldChangeFn,
  };

  test('should pass the initial render', () => {
    initDynaDateTime(props);
    expect(screen.getByText('formLabel')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('CalendarIcon')).toBeInTheDocument();
    expect(screen.getByText('AccessTimeIcon')).toBeInTheDocument();
    const dateField = screen.getByPlaceholderText('MM/DD/YYYY');

    expect(dateField).toHaveValue('06/07/2018');
    const timeField = document.querySelector('[value="12:00 AM"]');

    expect(timeField).toBeInTheDocument();
  });
  test('should make a dispatch call on initial render when valid date and time are passed in the props', async () => {
    initDynaDateTime(props);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('imports-5bf18b09294767270c62fad9')('dateTime', {isValid: true})));
  });
  test('should make a dispatch call with error message on initial render when invalid date and time are passed in the props', async () => {
    initDynaDateTime({...props, value: '2018-06-06T00:00000Z'});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('imports-5bf18b09294767270c62fad9')('dateTime', {isValid: false, errorMessages: 'Invalid date time value'})));
  });
  test('should not render the icons in the fields when "removePickerDialog" prop is sent as true', async () => {
    initDynaDateTime({...props, value: '', removePickerDialog: true});
    expect(screen.queryByText('CalendarIcon')).toBeNull();
    expect(screen.queryByText('AccessTimeIcon')).toBeNull();
  });
  test('should convert the date and time into an ISO string when the resource is an App or a ssLinkedConnectionId', () => {
    initDynaDateTime({...props,
      resourceContext: {
        resourceType: 'integrations',
        resourceId: '5ff579d745ceef7dcd797c16',
      }});
  });
  test('should be able to edit both date and time', () => {
    initDynaDateTime(props);
    const dateField = screen.getByPlaceholderText('MM/DD/YYYY');

    fireEvent.keyPress(dateField, {key: 'Enter', code: 'Enter', charCode: 13});
    fireEvent.keyDown(dateField, {
      key: 'Backspace',
      code: 'Backspace',
      keyCode: 8,
      charCode: 8,
    });
    fireEvent.change(dateField, {target: {value: '24/05/2020'}});
    expect(dateField).toHaveValue('24/05/2020');
    const timeField = document.querySelector('[value="12:00 AM"]');

    fireEvent.keyPress(timeField, {key: 'Enter', code: 'Enter', charCode: 13});
    fireEvent.keyDown(timeField, {
      key: 'Backspace',
      code: 'Backspace',
      keyCode: 8,
      charCode: 8,
    });
    fireEvent.change(timeField, {target: {value: '11:00 AM'}});
    expect(timeField).toHaveValue('11:00 AM');
  });
});

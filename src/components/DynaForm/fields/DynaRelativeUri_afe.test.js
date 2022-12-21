/* global describe, jest, expect, test, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import DynaRelativeUriAFE from './DynaRelativeUri_afe';
import { EXPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('./DynaURI_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaURI_afe'),
  default: ({stage, value, description}) => (
    <div>
      <span data-testid="stage">{stage}</span>
      <span data-testid="value">{value}</span>
      <span data-testid="description">{description}</span>
    </div>
  ),
}));

describe('test for relative uri field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should render the description in case of http connection', () => {
    const props = {
      id: 'http.dynarelativeuri',
      formKey: 'form-123',
      connectionId: 'connection123',
      resourceType: 'exports',
      resourceId: 'export123',
      value: '/Customers',
    };
    const baseURI = 'https://netsuite.com';
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
      type: 'http',
      http: { baseURI },
    }];
    renderWithProviders(<DynaRelativeUriAFE {...props} />, {initialStore});
    expect(screen.getByTestId('stage')).toHaveTextContent(EXPORT_FILTERED_DATA_STAGE);
    expect(screen.getByTestId('value')).toHaveTextContent(props.value);
    expect(screen.getByTestId('description')).toHaveTextContent(`Relative to: ${baseURI}`);
    expect(mockDispatchFn).not.toBeCalled();
  });

  test('should render the description in case of rest connection', () => {
    const props = {
      id: 'rest.dynarelativeuri',
      connectionId: 'connection123',
      resourceType: 'connections',
      resourceId: 'connection123',
      formKey: 'form-123',
      value: '/',
      validateInComponent: true,
    };
    const baseURI = 'https://netsuite.com';
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
      type: 'rest',
      rest: { baseURI },
    }];
    renderWithProviders(<DynaRelativeUriAFE {...props} />, {initialStore});
    expect(screen.getByTestId('stage')).toHaveTextContent('importMappingExtract');
    expect(screen.getByTestId('value')).toHaveTextContent(props.value);
    expect(screen.getByTestId('description')).toHaveTextContent(`Relative to: ${baseURI}`);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState(props.formKey)(props.id, {isValid: true}));
  });

  test('should show the error message if relative uri is required but not provided', () => {
    const props = {
      id: 'http.dynarelativeuri',
      connectionId: 'connection123',
      resourceType: 'exports',
      resourceId: 'export123',
      formKey: 'form-123',
      required: true,
      validateInComponent: true,
    };
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.connections = [{
      _id: props.connectionId,
      type: 'rest',
      rest: { baseURI: 'https://netsuite.com' },
    }];
    renderWithProviders(<DynaRelativeUriAFE {...props} />, {initialStore});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState(props.formKey)(props.id, {isValid: false, errorMessages: 'A value must be provided'}));
  });

  test('should populate the correct value if array of URIs passed', () => {
    const props = {
      connectionId: 'connection123',
      resourceType: 'exports',
      resourceId: 'export123',
      formKey: 'form-123',
      value: ['/Customers', '/users', '/items'],
      arrayIndex: 1,
      required: true,
    };

    renderWithProviders(<DynaRelativeUriAFE {...props} />);
    expect(screen.getByTestId('value')).toHaveTextContent(props.value[props.arrayIndex]);
    expect(screen.getByTestId('description')).toHaveTextContent('');
  });
});

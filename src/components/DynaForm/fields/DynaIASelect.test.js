import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import DynaIASelect from './DynaIASelect';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('./DynaMultiSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaMultiSelect'),
  default: ({id, options, onFieldChange}) => (
    <div data-testid="multiselect">
      <div data-testid="options">{JSON.stringify(options)}</div>
      <button type="button" onClick={() => onFieldChange(id, 'sampleVal')}>changeField</button>
    </div>
  ),
}));

jest.mock('./DynaSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSelect'),
  default: ({id, options, onFieldChange}) => (
    <div data-testid="select">
      <div data-testid="options">{JSON.stringify(options)}</div>
      <button type="button" onClick={() => onFieldChange(id, 'sampleVal')}>changeField</button>
    </div>
  ),
}));

describe('test suite for DynaIASelect field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should render DynaMultiSelect field if multiselect flag is set', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'http.multiselect',
      _integrationId: 'integration-123',
      multiselect: true,
      onFieldChange,
      autoPostBack: true,
      options: [{items: [
        {label: 'Option 4', value: 'value4'},
        {label: 'Option 5', value: 'value5'},
      ]}],
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.connectors[props._integrationId] = {
        [props.id]: {
          data: {
            options: [
              ['value1', 'Option 1'],
              ['value2', 'Option 2'],
              ['value3', 'Option 3'],
            ],
          },
        },
      };
    });

    renderWithProviders(<DynaIASelect {...props} />, {initialStore});
    expect(screen.getByTestId('multiselect')).toBeInTheDocument();

    //  should prefer the options present in state
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify(
      [{items: [{value: 'value1', label: 'Option 1'}, {value: 'value2', label: 'Option 2'}, {value: 'value3', label: 'Option 3'}]}]
    ));

    await userEvent.click(screen.getByRole('button', {name: 'changeField'}));
    expect(onFieldChange).toBeCalledWith(props.id, 'sampleVal');
    expect(mockDispatchFn).toBeCalledWith(actions.connectors.refreshMetadata('sampleVal', props.id, props._integrationId, {
      key: 'fieldValue',
      autoPostBack: true,
    }));
  });

  test('should render DynaSelect field if multiselect flag is unset', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'http.select',
      _integrationId: 'integration-123',
      onFieldChange,
      options: [{items: [
        {label: 'Option 4', value: 'value4'},
        {label: 'Option 5', value: 'value5'},
      ]}],
    };

    renderWithProviders(<DynaIASelect {...props} />);
    expect(screen.getByTestId('select')).toBeInTheDocument();

    //  should show the provided options
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify(
      [{items: [{label: 'Option 4', value: 'value4'}, {label: 'Option 5', value: 'value5'}]}]
    ));

    await userEvent.click(screen.getByRole('button', {name: 'changeField'}));
    expect(mockDispatchFn).not.toBeCalled();
    expect(onFieldChange).toBeCalledWith(props.id, 'sampleVal');
  });

  test('should not refresh metadata on changing value if autoPostBack flag is not set and state contains options', async () => {
    const onFieldChange = jest.fn();
    const props = {
      id: 'http.select',
      _integrationId: 'integration-123',
      onFieldChange,
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.connectors[props._integrationId] = {
        [props.id]: {
          data: {
            options: [
              ['value1', 'Option 1'],
              ['value2', 'Option 2'],
              ['value3', 'Option 3'],
            ],
          },
        },
      };
    });

    renderWithProviders(<DynaIASelect {...props} />, {initialStore});
    expect(screen.getByTestId('select')).toBeInTheDocument();

    //  should show the provided options
    expect(screen.getByTestId('options')).toHaveTextContent(JSON.stringify(
      [{items: [{value: 'value1', label: 'Option 1'}, {value: 'value2', label: 'Option 2'}, {value: 'value3', label: 'Option 3'}]}]));

    await userEvent.click(screen.getByRole('button', {name: 'changeField'}));
    expect(mockDispatchFn).not.toBeCalled();
    expect(onFieldChange).toBeCalledWith(props.id, 'sampleVal');
  });
});

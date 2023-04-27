
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
import DynaAssistantHeaders from './DynaAssistantHeaders';
import { reduxStore, renderWithProviders, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';

const initialStore = reduxStore;
const mockDispatchFn = jest.fn();
const mockOnFieldChange = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {pathname: '/'},
  }),
}));

function initDynaAssistantHeaders(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form[props.formKey] = {
      showValidationBeforeTouched: true,
    };
  });
  const ui = (
    <DynaAssistantHeaders {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaAssistantHeaders UI test cases', () => {
  test('should populate the assistant headers and make the dispatch call when the component is unmount and provided with no value', () => {
    const genralProps = {
      value: [{name: 'Name1', required: true}, {name: 'Name2', required: true}, {name: 'Name3', required: true}, {name: 'Name4', required: true}],
      formKey: 'someformkey',
      id: 'someid',
      onFieldChange: mockOnFieldChange,
      headersMetadata: [{name: 'somename', required: true}],
    };
    const { utils: { unmount } } = initDynaAssistantHeaders(genralProps);

    expect(screen.getByDisplayValue('Name1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name4')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('someformkey')('someid', {isValid: false, errorMessages: 'Name1, Name2, Name3, Name4 headers are required'}));
    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.clearForceFieldState('someformkey')('someid'));
  });
  test('should make the dispatch call when the component is unmount when provided with value', () => {
    const genralProps = {
      value: [{name: 'Name1', value: 'Value1', required: true}, {name: 'Name2', value: 'Value2', required: true}, {name: 'Name3', value: 'Value3', required: true}, {name: 'Name4', value: 'Value4', required: true}],
      formKey: 'someformkey',
      id: 'someid',
      ignoreEmptyRow: () => {},
      onFieldChange: mockOnFieldChange,
      headersMetadata: [{name: 'somename', required: true}],
    };
    const { utils: { unmount } } = initDynaAssistantHeaders(genralProps);

    expect(screen.getByDisplayValue('Name1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Name4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Value1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Value2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Value3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Value4')).toBeInTheDocument();

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('someformkey')('someid', {isValid: true}));
    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.clearForceFieldState('someformkey')('someid'));
  });
  test('should call FieldMessage component when error message is provided', () => {
    const genralProps = {
      value: [{name: 'Name1', value: 'Value1', required: true}, {name: 'Name2', value: 'Value2', required: true}, {name: 'Name3', value: 'Value3', required: true}, {name: 'Name4', value: 'Value4', required: true}],
      formKey: 'someformkey',
      id: 'someid',
      onFieldChange: mockOnFieldChange,
      isValid: false,
      description: 'some description',
      errorMessages: 'some error message',
      headersMetadata: [{name: 'somename', required: true}],
    };

    initDynaAssistantHeaders(genralProps);
    expect(screen.getByText('some error message')).toBeInTheDocument();
  });
});

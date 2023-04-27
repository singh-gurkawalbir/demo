
import React from 'react';
import {
  screen, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaSelectWithInput from './DynaSelectWithInput';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.form.someformKey = {value: {fieldForMediaType: 'json'}};

  draft.data.resources.connections = [{
    _id: 'someconnectionId',
    http: {
      type: 'Amazon-Hybrid',
    },
  }];
});

const mockOnFieldChange = jest.fn();

const genProps =
{
  label: 'Props Label',
  helpKey: 'somehelpKey',
  value: 'some',
  placeholder: 'PlaceHolderText',
  id: 'someID',
  options: [{label: 'someLabel', value: 'someValue'}],
  onFieldChange: mockOnFieldChange,
  resourceType: 'imports',
};

function initDynaSelectWithInput(props = {}) {
  const ui = (
    <DynaSelectWithInput
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaSelectAmazonSellerCentralAPIType UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show option provided from props', async () => {
    initDynaSelectWithInput(genProps);
    expect(screen.getByText('Props Label')).toBeInTheDocument();
    expect(screen.getByText('some')).toBeInTheDocument();

    fireEvent.focusIn(screen.getByPlaceholderText('PlaceHolderText'));
    await userEvent.click(screen.getByText('someLabel'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', 'someValue');
  });
  test('should show options based provided label key and value key', async () => {
    const props = {labelName: 'someLabel', valueName: 'someValue', options: [{someLabel: 'someLabel', someValue: 'someValue'}]};

    initDynaSelectWithInput({...genProps, ...props});

    expect(screen.getByText('Props Label')).toBeInTheDocument();
    expect(screen.getByText('some')).toBeInTheDocument();

    fireEvent.focusIn(screen.getByPlaceholderText('PlaceHolderText'));
    await userEvent.click(screen.getByText('someLabel'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', 'someValue');
  });
  test('should show the error message when in valid props is provided as true', () => {
    const props = {errorMessages: 'someerrorMessages', isValid: false};

    initDynaSelectWithInput({...genProps, ...props});
    expect(screen.getByText('someerrorMessages')).toBeInTheDocument();
  });
});

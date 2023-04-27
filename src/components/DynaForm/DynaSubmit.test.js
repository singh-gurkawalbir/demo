
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormButton from './DynaSubmit';
import { renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import actions from '../../actions';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.form = {
    firstformKey: {fields: 'someFields'},
    secondformKey: {fields: {}, value: 'someValue'},
    thisrdformKey: {fields: {defaultVisible: false}, value: 'someValue'},

  };
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initDynaSubmit(props = {}) {
  const ui = (
    <FormButton
      {...props}
      >Child text
    </FormButton>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockOnClick = jest.fn();

describe('dynaSubmit Ui test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call the mockOnClick function on clicking the submit button when disable button is skipped from touch', async () => {
    initDynaSubmit({formKey: 'secondformKey', formDisabled: false, skipDisableButtonForFormTouched: true, onClick: mockOnClick });
    await userEvent.click(screen.getByText('Child text'));
    expect(mockOnClick).toHaveBeenCalledWith('someValue');
  });
  test('should make dispatch call for form validation when disable button is not skipped from touch', async () => {
    initDynaSubmit({formKey: 'secondformKey', formDisabled: false, ignoreFormTouchedCheck: true, skipDisableButtonForFormTouched: false, onClick: mockOnClick });

    await userEvent.click(screen.getByText('Child text'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.form.showFormValidations('secondformKey')
    );
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  test('should make the dispatch call for validation and call mock on click function when clicked on submit button', async () => {
    initDynaSubmit({formKey: 'secondformKey', isValid: true, formDisabled: false, ignoreFormTouchedCheck: true, skipDisableButtonForFormTouched: false, onClick: mockOnClick });

    await userEvent.click(screen.getByText('Child text'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.form.showFormValidations('secondformKey')
    );
    expect(mockOnClick).toHaveBeenCalledWith('someValue');
  });
  test('should show submit button as disabled when disable prop is true', () => {
    initDynaSubmit({formKey: 'secondformKey', isValid: true, disabled: true, ignoreFormTouchedCheck: true, skipDisableButtonForFormTouched: false, onClick: mockOnClick });

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});

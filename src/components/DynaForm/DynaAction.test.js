
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaAction from './DynaAction';
import { renderWithProviders, reduxStore, mutateStore} from '../../test/test-utils';
import actions from '../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.form = {
    firstformKey: {fields: 'someFields'},
    secondformKey: {fields: {}, value: 'someValue'},
    thisrdformKey: {fields: {defaultVisible: false}, value: 'someValue'},
    fourthformKey: {fields: {someField: {value: 'isnotValue'}}, value: 'someValue'},

  };
});

function initDynaAction(props = {}) {
  const ui = (
    <DynaAction
      {...props}
      >
      Child Text
    </DynaAction>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaAction ui test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show empty dom when no props provided', () => {
    const {utils} = renderWithProviders(
      <DynaAction
        formKey="someformkey"
      />
    );

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should click on Dyna action button and make dispatch call for form validation', async () => {
    initDynaAction({formKey: 'secondformKey', ignoreFormTouchedCheck: true});
    await userEvent.click(screen.getByText('Child Text'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.form.showFormValidations('secondformKey')
    );
  });
  test('should not show button when visibility is false because of visibleWhen case', () => {
    initDynaAction({formKey: 'fourthformKey', ignoreFormTouchedCheck: true, visibleWhen: [{field: 'someField', isNot: [{value: 'isnotValue'}]}]});

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  test('should not show button when visibility is false because of visibleWhenAll case', () => {
    initDynaAction({formKey: 'fourthformKey', ignoreFormTouchedCheck: true, visibleWhen: [{field: 'someField', isNot: [{value: 'isnotValue'}]}]});

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

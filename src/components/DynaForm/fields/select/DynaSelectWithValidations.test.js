
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import DynaSelectWithValidations from './DynaSelectWithValidations';

const props = {formKey: '_formKey', value: '/file/name', options: [{items: [{value: '/file/name', fieldsToValidate: ['_field1'], description: '_description', regex: 'something'}]}]};

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

async function initDynaSelectWithValidations(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.form = {
      _formKey: {
        fields: {
          _field1: {value: 'something'},
        },
      },
    };
  });

  return renderWithProviders(<DynaSelectWithValidations {...props} />, { initialStore });
}
describe('dynaSelectWithValidations tests', () => {
  test('should test dynaSelect field validation without proper formFields', async () => {
    await initDynaSelectWithValidations({...props, formKey: 'random'});
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.queryByText('_description')).toBeInTheDocument();
  });
  test('should test dynaSelect field validation with proper formField', async () => {
    await initDynaSelectWithValidations(props);
    expect(screen.queryByText('_description')).not.toBeInTheDocument();
  });
  test('should test dynaSelect field validation without proper options', async () => {
    await initDynaSelectWithValidations({...props, options: undefined});
    expect(screen.queryByText('_description')).not.toBeInTheDocument();
  });
});


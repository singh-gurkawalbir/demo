import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import CodePanel from '.';

jest.mock('../../../../CodeEditor2', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../CodeEditor2'),
  default: props => (
    <div>{props.value}</div>
  ),
}));

describe('aFE CodePanel UI tests', () => {
  test('should pass the initial render', async () => {
    const props = {
      name: 'data',
      value: {
        record: {
          myField: 'sample',
        },
        connection: {
          name: 'demo',
          http: {
            unencrypted: {
              field: 'value',
            },
            encrypted: '********',
          },
        },
      },
      mode: 'json',
      errorLine: false,
      hasError: false,
    };

    renderWithProviders(<CodePanel {...props} />);
    await waitFor(() => expect(screen.getByText(/myField/i, {exact: false})).toBeInTheDocument());
  });
  test('should pass the initial render when value is of type string', async () => {
    const props = {
      name: 'data',
      value: 'string value',
      mode: 'json',
      errorLine: false,
      hasError: false,
    };

    renderWithProviders(<CodePanel {...props} />);
    await waitFor(() => expect(screen.getByText(/string value/i, {exact: false})).toBeInTheDocument());
  });
  test('should pass the initial render when value is of type number', async () => {
    const props = {
      name: 'data',
      value: 123,
      mode: 'json',
      errorLine: false,
      hasError: false,
    };

    renderWithProviders(<CodePanel {...props} />);
    await waitFor(() => expect(screen.getByText(/123/i, {exact: false})).toBeInTheDocument());
  });
});

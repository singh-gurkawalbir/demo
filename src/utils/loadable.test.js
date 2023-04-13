import { screen } from '@testing-library/react';
import React from 'react';
import { Loading } from './loadable';
import { renderWithProviders } from '../test/test-utils';

function initLoadbleLoading({ error, timedOut, pastDelay }) {
  const ui = (
    <Loading error={error} timedOut={timedOut} pastDelay={pastDelay} />
  );

  return renderWithProviders(ui);
}

jest.mock('../components/Loader', () => ({
  __esModule: true,
  ...jest.requireActual('../components/Loader'),
  default: props => (
    <>
      <div>Mock Loader</div>
      <div>{props.children}</div>
    </>
  ),
}));
describe('Testsuite for Loadable', () => {
  test('should test the error message when error is passed to Loading', async () => {
    let error;

    try {
      initLoadbleLoading({
        error: 'test error',
        timedOut: true,
        pastDelay: true,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBe('test error');
  });
  test('should test the loading text when timedOut set to true and pastDelay is false', async () => {
    initLoadbleLoading({
      error: undefined,
      timedOut: true,
      pastDelay: false,
    });
    expect(screen.getByText(/mock loader/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /loading/i,
    })).toBeInTheDocument();
  });
  test('should test the loading text when timedOut set to false and pastDelay is true', async () => {
    initLoadbleLoading({
      error: undefined,
      timedOut: false,
      pastDelay: true,
    });
    expect(screen.getByText(/mock loader/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /loading/i,
    })).toBeInTheDocument();
  });
  test('should test the empty dom when error, timedOut and pastDelay is set to false', async () => {
    const {container} = initLoadbleLoading({
      error: undefined,
      timedOut: false,
      pastDelay: false,
    });

    expect(container).toBeUndefined();
  });
});

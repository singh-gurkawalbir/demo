/* global jest, expect, test, describe */
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ErrorCountCell from '.';
import {renderWithProviders} from '../../../test/test-utils';

async function initErrorCountCell({count, isError, onClick = jest.fn(), isJobInProgress, className} = {}) {
  const ui = (
    <MemoryRouter>
      <ErrorCountCell
        count={count} isError={isError} onClick={onClick} isJobInProgress={isJobInProgress}
        className={className} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('Testsuite for ErrorCountCell', () => {
  test('should test the error count cell when the count, isError, isJobInProgress is undefined', async () => {
    await initErrorCountCell();
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent('');
  });
  test('should render error count when job is in progress', async () => {
    await initErrorCountCell({count: 0, isError: true, isJobInProgress: true});
    expect(document.querySelector('td[data-test="view-job-error"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-error"]'));
    expect(document.querySelector('td[data-test="view-job-error"]')).toHaveTextContent(0);
  });
  test('should render error count when job is not in progress and has errors', async () => {
    await initErrorCountCell({count: 1, isError: true, isJobInProgress: false});
    expect(document.querySelector('td[data-test="view-job-error"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-error"]'));
    expect(document.querySelector('td[data-test="view-job-error"]')).toHaveTextContent(/view/i);
    userEvent.unhover(document.querySelector('td[data-test="view-job-error"]'));
    expect(document.querySelector('td[data-test="view-job-error"]')).toHaveTextContent(1);
  });
  test('should render resolved count when job is not in progress and has no errors', async () => {
    await initErrorCountCell({count: 2, isError: false, isJobInProgress: false});
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent(/view/i);
    userEvent.unhover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent(2);
  });
  test('should render resolved count when job is in progress and has no errors', async () => {
    await initErrorCountCell({count: 2, isError: false, isJobInProgress: true});
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).not.toHaveTextContent(/view/i);
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent(2);
  });
});

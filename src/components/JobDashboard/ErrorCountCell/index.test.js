/* global jest, expect, test, describe */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ErrorCountCell from '.';

function initErrorCountCell({count, isError, onClick = jest.fn(), isJobInProgress, className} = {}) {
  const ui = (
    <ErrorCountCell
      count={count} isError={isError} onClick={onClick} isJobInProgress={isJobInProgress}
      className={className} />
  );

  return render(ui);
}

describe('Testsuite for ErrorCountCell', () => {
  test('should test the error count cell when the count, isError, isJobInProgress is undefined', () => {
    initErrorCountCell();
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent('');
  });
  test('should render error count when job is in progress', () => {
    initErrorCountCell({count: 0, isError: true, isJobInProgress: true});
    expect(document.querySelector('td[data-test="view-job-error"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-error"]'));
    expect(document.querySelector('td[data-test="view-job-error"]')).toHaveTextContent(0);
  });
  test('should render error count when job is not in progress and has errors and click on the count', () => {
    const mockOnClick = jest.fn();

    initErrorCountCell({count: 1, isError: true, onClick: mockOnClick, isJobInProgress: false});
    expect(document.querySelector('td[data-test="view-job-error"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-error"]'));
    expect(document.querySelector('td[data-test="view-job-error"]')).toHaveTextContent(/view/i);
    userEvent.unhover(document.querySelector('td[data-test="view-job-error"]'));
    expect(document.querySelector('td[data-test="view-job-error"]')).toHaveTextContent(1);
    userEvent.click(document.querySelector('td[data-test="view-job-error"]'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/View/)).toBeInTheDocument();
  });
  test('should render resolved count when job is not in progress and has no errors', () => {
    initErrorCountCell({count: 2, isError: false, isJobInProgress: false});
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent(/view/i);
    userEvent.unhover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent(2);
  });
  test('should render resolved count when job is in progress and has no errors', () => {
    initErrorCountCell({count: 2, isError: false, isJobInProgress: true});
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toBeInTheDocument();
    userEvent.hover(document.querySelector('td[data-test="view-job-resolved"]'));
    expect(document.querySelector('td[data-test="view-job-resolved"]')).not.toHaveTextContent(/view/i);
    expect(document.querySelector('td[data-test="view-job-resolved"]')).toHaveTextContent(2);
  });
});

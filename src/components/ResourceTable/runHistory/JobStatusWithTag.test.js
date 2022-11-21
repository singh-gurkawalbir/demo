/* global test, expect, describe */
import React from 'react';
import { screen, render } from '@testing-library/react';
import JobStatusWithTag from './JobStatusWithTag';

function initJobStatusWithTag(props) {
  const ui = (
    <JobStatusWithTag {...props} />
  );

  return render(ui);
}

describe('JobStatusWithTag test cases', () => {
  test('should show completed message with errors', () => {
    initJobStatusWithTag({job: {status: 'completedWithErrors'}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show completed message without errors', () => {
    initJobStatusWithTag({job: {status: 'completed'}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show canceled message', () => {
    initJobStatusWithTag({job: {status: 'canceled'}});
    expect(screen.getByText('Canceled')).toBeInTheDocument();
  });
  test('should show failed message', () => {
    initJobStatusWithTag({job: {status: 'failed'}});
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
  test('should show Random message', () => {
    initJobStatusWithTag({job: {status: 'random'}});
    expect(screen.getByText('random')).toBeInTheDocument();
  });
  test('should show complete with errors and error', () => {
    initJobStatusWithTag({job: {status: 'completed', numOpenError: 1}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show complete with errors and error', () => {
    initJobStatusWithTag({job: {status: 'completed', numOpenError: 1}});
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  test('should show empty dom when no props are provided', () => {
    const utils = initJobStatusWithTag({job: {}});

    expect(utils.container).toBeEmptyDOMElement();
  });
});

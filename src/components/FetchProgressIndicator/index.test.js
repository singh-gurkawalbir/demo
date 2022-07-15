/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import FetchProgressIndicator from '.';

function ProgressIndicator(props = {}) {
  const initialStore = reduxStore;

  const ui = (
    <FetchProgressIndicator {...props} />
  );

  return renderWithProviders(ui, { initialStore });
}

describe('FetchProgressIndicator UI tests', () => {
  const mockFunc = jest.fn();

  test('should render empty DOM for input status completed', () => {
    ProgressIndicator({
      fetchStatus: 'completed',
      pauseHandler: mockFunc,
      resumeHandler: mockFunc,
      startTime: 0,
      endTime: 92,
      currTime: 0,
    });
    expect(screen.queryByText('/Resume/i', { exact: false })).toBeNull();
  });
  test('should display fetching logs message for fetch status inProgress', () => {
    ProgressIndicator({
      fetchStatus: 'inProgress',
      pauseHandler: mockFunc,
      resumeHandler: mockFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByText('Fetching logs', {exact: false})).toBeInTheDocument();
  });
  test('should display the "Fetching paused" message for fetch status "paused"', () => {
    ProgressIndicator({
      fetchStatus: 'paused',
      pauseHandler: mockFunc,
      resumeHandler: mockFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByText(/Fetching paused/i, {exact: false})).toBeInTheDocument();
  });
  test('should render both Pause and resume buttons for inProgress status', () => {
    ProgressIndicator({
      fetchStatus: 'inProgress',
      pauseHandler: mockFunc,
      resumeHandler: mockFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    ProgressIndicator({
      fetchStatus: 'paused',
      pauseHandler: mockFunc,
      resumeHandler: mockFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });
  test('should render empty DOM for negative value of percentage done', () => {
    const { utils } = ProgressIndicator({
      fetchStatus: 'paused',
      pauseHandler: mockFunc,
      resumeHandler: mockFunc,
      startTime: 20,
      endTime: 100,
      currTime: 180,
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});


/* global describe, test, expect, jest, */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import FetchProgressIndicator from '.';

function ProgressIndicator(props = {}) {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter>
      <FetchProgressIndicator {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('FetchProgressIndicator UI tests', () => {
  const mockPauseFunc = jest.fn();
  const mockResumeFunc = jest.fn();

  test('For input status completed,DOM should be empty', () => {
    ProgressIndicator({
      fetchStatus: 'completed',
      pauseHandler: mockPauseFunc,
      resumeHandler: mockResumeFunc,
      startTime: 0,
      endTime: 92,
      currTime: 0,
    });
    expect(screen.queryByText('/Resume/i', { exact: false })).toBeNull();
  });
  test('For input status completed,DOM should be empty', () => {
    ProgressIndicator({
      fetchStatus: 'inProgress',
      pauseHandler: mockPauseFunc,
      resumeHandler: mockResumeFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByText(/Fetching Logs/i, {exact: false})).toBeInTheDocument();
  });
  test('For input status completed,DOM should be empty', () => {
    ProgressIndicator({
      fetchStatus: 'paused',
      pauseHandler: mockPauseFunc,
      resumeHandler: mockResumeFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByText(/Fetching Paused/i, {exact: false})).toBeInTheDocument();
  });
  test('checking the render of both Pause button', () => {
    ProgressIndicator({
      fetchStatus: 'inProgress',
      pauseHandler: mockPauseFunc,
      resumeHandler: mockResumeFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });
  test('checking the render of resume button', () => {
    ProgressIndicator({
      fetchStatus: 'paused',
      pauseHandler: mockPauseFunc,
      resumeHandler: mockResumeFunc,
      startTime: 20,
      endTime: 100,
      currTime: 80,
    });

    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });
  test('checking for negative value of percentage done', () => {
    const { utils } = ProgressIndicator({
      fetchStatus: 'paused',
      pauseHandler: mockPauseFunc,
      resumeHandler: mockResumeFunc,
      startTime: 20,
      endTime: 100,
      currTime: 180,
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});

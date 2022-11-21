/* global describe, test, expect, jest, beforeEach, afterEach  */
import { screen } from '@testing-library/react';
import React from 'react';
import CompletedFlows from '.';
import { getCreatedStore } from '../../../../store';
import {renderWithProviders} from '../../../../test/test-utils';

let initialStore;

async function initCompletedFlows(data) {
  initialStore.getState().data.completedJobs = data;
  const ui = (
    <CompletedFlows />
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../Filters', () => ({
  __esModule: true,
  ...jest.requireActual('../Filters'),
  default: props => (
    <div>filterKey = {props.filterKey}</div>
  ),
}));
jest.mock('../../RunHistoryDrawer', () => ({
  __esModule: true,
  ...jest.requireActual('../../RunHistoryDrawer'),
  default: () => (
    <div>Testing RunHistoryDrawer</div>
  ),
}));
jest.mock('../../../../views/Integration/common/ErrorsList', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../views/Integration/common/ErrorsList'),
  default: () => (
    <div>Testing ErrorsList</div>
  ),
}));
jest.mock('../../../ResourceTable', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ResourceTable'),
  default: props => (
    <div>Resource Table Resources = {props.resources}</div>
  ),
}));

describe('Testsuite for Completed Flows', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should render the dashboard with empty flows', async () => {
    await initCompletedFlows();
    expect(screen.getByText(/you don't have any completed flows in the selected date range\./i)).toBeInTheDocument();
    expect(screen.getByText(/Testing RunHistoryDrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing ErrorsList/i)).toBeInTheDocument();
  });
  test('should test the spinner whent the completed status is loading', async () => {
    const data = {
      completedJobs: [],
      status: 'loading',
    };

    await initCompletedFlows(data);
    const spinnerNode = screen.getByRole('progressbar');

    expect(spinnerNode.className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(screen.getByText(/Testing RunHistoryDrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing ErrorsList/i)).toBeInTheDocument();
  });
  test('should test the loaded completed jobs when status is success', async () => {
    const data = {
      completedJobs: [
        'testing completed jobs',
      ],
      status: 'success',
    };

    await initCompletedFlows(data);
    expect(screen.getByText(/filterkey = completedflows/i)).toBeInTheDocument();
    expect(screen.getByText(/resource table resources = testing completed jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing RunHistoryDrawer/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing ErrorsList/i)).toBeInTheDocument();
  });
});

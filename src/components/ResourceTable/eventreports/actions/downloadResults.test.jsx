/* global test, expect, describe, beforeEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';
import metadata from '../metadata';
import CeligoTable from '../../../CeligoTable';

const initialStore = reduxStore;

initialStore.getState().data.resources = {
  flows: [{
    _id: 'flow_id_1',
    name: 'flow name 1',
    _integrationId: 'integration_id_1',
  }]};

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        {...metadata}
        data={[data]} />
    </MemoryRouter>, {initialStore}
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('UI test cases for download results', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should make a dispatch call after clicking on download result', () => {
    renderFuntion({_id: 'flow_id_1', status: 'completed', _flowIds: ['flow_id_1']});
    const downloadResultsButton = screen.getByText('Download results');

    userEvent.click(downloadResultsButton);
    expect(mockDispatchFn).toHaveBeenCalledWith({reportId: 'flow_id_1', type: 'EVENT_REPORT_DOWNLOAD'});
  });
});

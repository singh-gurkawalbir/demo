
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
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
    <CeligoTable
      {...metadata}
      data={[data]} />, {initialStore}
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('uI test cases for cancelreport', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should make a dispatch call after clicking on cancel report', () => {
    renderFuntion({_id: 'flow_id_1', status: 'queued', _flowIds: ['flow_id_1']});
    const cancelReportButton = screen.getByText('Cancel Report');

    userEvent.click(cancelReportButton);
    expect(mockDispatchFn).toHaveBeenCalledWith({reportId: 'flow_id_1', type: 'EVENT_REPORT_CANCEL'});
  });
});

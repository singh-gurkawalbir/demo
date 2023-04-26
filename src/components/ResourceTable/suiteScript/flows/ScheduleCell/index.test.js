
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import ScheduleCell from './index';
import { renderWithProviders } from '../../../../../test/test-utils';

jest.mock('../../../../icons/CalendarIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/CalendarIcon'),
  default: () => (
    <div>Calendar</div>
  ),
}));

describe('suite script ScheduleCell ui test', () => {
  test('should show empty dom when no props are provided', () => {
    const utils = renderWithProviders(<MemoryRouter><ScheduleCell /></MemoryRouter>);

    expect(utils.container).toBeUndefined();
  });

  test('should show no option for schedule when flow type is not of schedule', () => {
    renderWithProviders(<MemoryRouter><ScheduleCell flow={{type: 'REALTIME_EXPORT', hasConfiguration: true}} /></MemoryRouter>);
    expect(screen.getByText('Realtime')).toBeInTheDocument();
    const link = screen.queryByRole('link');

    expect(link).not.toBeInTheDocument();
  });
  test('should disable the button when props for ecit is not sent', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/initialURL'}]}>
        <Route
          path="/initialURL"
          params={{}}
          ><ScheduleCell flow={{_id: 'someFlowID', type: 'EXPORT', hasConfiguration: true}} />
        </Route>
      </MemoryRouter>);
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/initialURL/someFlowID/schedule');
    expect(screen.getByText('Calendar')).toBeInTheDocument();

    const disable = link.getAttribute('aria-disabled');

    expect(disable).toBe('true');
  });
  test('should show the link button as enabled', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname: '/initialURL'}]}>
        <Route
          path="/initialURL"
          params={{}}
          ><ScheduleCell flow={{_id: 'someFlowID', type: 'EXPORT', hasConfiguration: true, editable: true}} />
        </Route>
      </MemoryRouter>);
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/initialURL/someFlowID/schedule');
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    const disable = link.getAttribute('aria-disabled');

    expect(disable).toBeNull();
  });
});

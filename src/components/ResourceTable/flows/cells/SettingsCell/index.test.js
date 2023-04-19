
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RemoveMargin from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

jest.mock('../../../../icons/SettingsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/SettingsIcon'),
  default: () => (
    <div>SettingsIcon</div>
  ),
}));

describe('setting cell test cases', () => {
  test('should show empty dom when flow doesnot supports settings', () => {
    const {container} = renderWithProviders(<MemoryRouter><RemoveMargin actionProps={{flowAttributes: {}}} /></MemoryRouter>);

    expect(container).toBeUndefined();
  });
  test('should show empty dom when flow supports settings', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/integrations/integration_id/flows']}>
        <Route path="/integrations/integration_id/flows">
          <RemoveMargin
            flowId="someFlowId"
            name="someName"
            actionProps={{flowAttributes: {someFlowId: {supportsSettings: true}}}} />
        </Route>
      </MemoryRouter>);

    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/integrations/integration_id/flows/someFlowId/settings');

    expect(screen.getByText('SettingsIcon')).toBeInTheDocument();
    userEvent.hover(link);

    await waitFor(() => expect(screen.queryByText('Configure settings')).toBeInTheDocument());
  });
});

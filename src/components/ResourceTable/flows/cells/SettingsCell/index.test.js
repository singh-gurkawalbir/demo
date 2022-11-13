/* global describe, test,expect, jest */
import React from 'react';
import { screen, waitFor, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RemoveMargin from '.';

jest.mock('../../../../icons/SettingsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/SettingsIcon'),
  default: () => (
    <div>SettingsIcon</div>
  ),
}));

describe('Settign cell test cases', () => {
  test('should show empty dom when flow doesnot supoorts settings', () => {
    const {container} = render(<MemoryRouter><RemoveMargin actionProps={{flowAttributes: {}}} /></MemoryRouter>);

    expect(container).toBeEmptyDOMElement();
  });
  test('should show empty dom when flow doesnot supoorts seteqrtings', async () => {
    render(
      <MemoryRouter initialEntries={['/parentUrl']}>
        <Route path="/parentUrl">
          <RemoveMargin
            flowId="someFlowId"
            name="someName"
            actionProps={{flowAttributes: {someFlowId: {supportsSettings: true}}}} />
        </Route>
      </MemoryRouter>);

    const link = screen.getByRole('button');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/parentUrl/someFlowId/settings');

    expect(screen.getByText('SettingsIcon')).toBeInTheDocument();
    userEvent.hover(link);

    await waitFor(() => expect(screen.queryByText('Configure settings')).toBeInTheDocument());
  });
});

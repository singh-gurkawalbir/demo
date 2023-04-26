import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ActionIconButton from './index';
import { renderWithProviders } from '../../../test/test-utils';
import { FlowProvider } from '../FlowBuilderBody/Context';

async function initActionIconButton({actionIconProps} = {}) {
  const ui = (
    <MemoryRouter>
      <FlowProvider>
        <ActionIconButton {...actionIconProps} />
      </FlowProvider>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}
describe('Action Icon Button', () => {
  test('Should able to test the Flow Builder action button with help text', async () => {
    const actionIconProps = {
      helpText: 'Test help text',
      children: 'Test children',
    };

    await initActionIconButton({actionIconProps});
    waitFor(async () => {
      const helpTextButton = screen.getByRole('button', {name: 'Test help text'});

      expect(helpTextButton).toBeInTheDocument();
      await userEvent.hover(helpTextButton);
      expect(helpTextButton).not.toHaveAccessibleName('Test help text');
    });
    waitFor(() => {
      const childrenNode = screen.getByText(/Test children/i);

      expect(childrenNode).toBeInTheDocument();
    });
  });
  test('Should able to test the Flow Builder action button with help key', async () => {
    const actionIconProps = {
      helpKey: 'fb.pg.exports.schedule',
      children: 'Test children',
    };

    await initActionIconButton({actionIconProps});
    waitFor(() => {
      const button = screen.getByRole('button', {name: "Define a 'schedule override' here to run this export/transfer on its own schedule."});

      expect(button).toBeInTheDocument();
    });
    waitFor(() => {
      const childrenNode = screen.getByText(/Test children/i);

      expect(childrenNode).toBeInTheDocument();
    });
  });
});

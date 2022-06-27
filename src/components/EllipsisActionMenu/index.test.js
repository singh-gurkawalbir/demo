/* eslint-disable no-undef */
import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import EllipsisActionMenu from '.';

const mockOnClick = jest.fn();
const actionsMenu = [
  {
    action: 'cloneIntegration',
    label: 'Clone-integration',
  },
  {
    action: 'generateTemplateZip',
    label: 'Download-integration',
  },
  {
    action: 'deleteIntegration',
    label: 'Delete-integration',
  },
];

describe('ellipsis menu ui tests', () => {
  test('presence of ellipsis menu button', () => {
    renderWithProviders(<EllipsisActionMenu />);
    const actionButton = screen.getAllByRole('button');

    expect(actionButton).toHaveLength(1);
  });
  test('correct number of menu list items have to be rendered', () => {
    renderWithProviders(
      <MemoryRouter>
        <EllipsisActionMenu
          actionsMenu={actionsMenu}
          onAction={mockOnClick}
          alignment="vertical"
        />
      </MemoryRouter>
    );
    const actionButton = screen.getByRole('button');

    expect(actionButton).toBeInTheDocument();
    userEvent.click(actionButton);
    const numberOfActions = screen.getAllByRole('menuitem');

    expect(numberOfActions).toHaveLength(3);
    screen.debug();
  });
  test('checking the functioning of menu item', async () => {
    const mockOnClick = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <EllipsisActionMenu
          actionsMenu={actionsMenu}
          onAction={mockOnClick}
          alignment="vertical"
        />
      </MemoryRouter>
    );
    const actionButton = screen.getByRole('button');

    expect(actionButton).toBeInTheDocument();
    userEvent.click(actionButton);
    const cloned = screen.getByText('Clone-integration');

    userEvent.click(cloned);
    await waitFor(() =>
      expect(mockOnClick).toHaveBeenCalledWith('cloneIntegration')
    );
  });
  test('checking the functionality of the button', async () => {
    const mockOnClick = jest.fn();

    renderWithProviders(
      <MemoryRouter>
        <EllipsisActionMenu
          actionsMenu={actionsMenu}
          onAction={mockOnClick}
          label="Text Button"
        />
      </MemoryRouter>
    );
    const button = screen.getByText('Text Button');

    expect(button).toBeInTheDocument();
  });
});

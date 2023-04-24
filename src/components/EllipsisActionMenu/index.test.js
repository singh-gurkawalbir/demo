
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import EllipsisActionMenu from '.';

const mockOnClick = jest.fn();
const actionsMenu = [
  {
    action: 'cloneIntegration',
    label: 'Clone integration',
  },
  {
    action: 'generateTemplateZip',
    label: 'Download integration',
  },
  {
    action: 'deleteIntegration',
    label: 'Delete integration',
  },
];

jest.mock('../icons/TrashIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../icons/TrashIcon'),
  default: () => (
    <div>Delete</div>
  ),
}));

describe('ellipsis menu ui tests', () => {
  test('should display the ellipsis menu icon', () => {
    renderWithProviders(<EllipsisActionMenu />);
    const actionButton = screen.getAllByRole('button');

    expect(actionButton).toHaveLength(1);
  });
  test('should display the same number of options that are passed in props on clicking the ellipsis icon', async () => {
    renderWithProviders(

      <EllipsisActionMenu
        actionsMenu={actionsMenu}
        onAction={mockOnClick}
        alignment="vertical"
        />
    );
    screen.debug();
    const actionButton = document.querySelector('[type="button"]');

    await waitFor(() => expect(actionButton).toBeInTheDocument());
    userEvent.click(actionButton);
    const numberOfActions = screen.getAllByRole('menuitem');

    expect(numberOfActions).toHaveLength(3);
  });
  test('should call the onClick function with the respective input when clicked on a menuItem', async () => {
    const mockOnClick = jest.fn();

    renderWithProviders(
      <EllipsisActionMenu
        actionsMenu={actionsMenu}
        onAction={mockOnClick}
        alignment="vertical"
        />
    );
    const actionButton = screen.getByRole('button');

    expect(actionButton).toBeInTheDocument();
    await userEvent.click(actionButton);
    const cloned = screen.getByText('Clone-integration');

    await userEvent.click(cloned);
    await waitFor(() =>
      expect(mockOnClick).toHaveBeenCalledWith('cloneIntegration')
    );
  });
  test('should render the text button when label is passed as "Text Button"', async () => {
    const mockOnClick = jest.fn();

    renderWithProviders(

      <EllipsisActionMenu
        actionsMenu={actionsMenu}
        onAction={mockOnClick}
        label="Text Button"
        />
    );
    const button = screen.getByText('Text Button');

    expect(button).toBeInTheDocument();
  });
});


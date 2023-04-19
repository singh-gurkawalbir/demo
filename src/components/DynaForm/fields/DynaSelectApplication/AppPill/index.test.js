import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import AppPill from '.';
import * as ApplicationsList from '../../../../../constants/applications';
import { renderWithProviders } from '../../../../../test/test-utils';

const mockOnRemove = jest.fn();

jest.mock('../../../../icons/ApplicationImg', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/ApplicationImg'),
  default: props => (
    <div>
      <div>Mock Application Image</div>
      <div>type = {props.type}</div>
      <div>assistant = {props.assistant}</div>
    </div>
  ),
}));
jest.mock('../../../../icons/CloseIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/CloseIcon'),
  default: () => (
    <div>Mock Close Icon</div>
  ),
}));
describe('Testsuite for AppPill', () => {
  afterEach(() => {
    mockOnRemove.mockClear();
  });
  test('should test the App Pill initial render and test the Application Image when there is no app icon and test the close button', async () => {
    jest.spyOn(ApplicationsList, 'applicationsList').mockReturnValue([{id: '123', assistant: 'test assistant', type: 'test type'}]);
    renderWithProviders(
      <AppPill appId="123" onRemove={mockOnRemove} />
    );
    expect(screen.getByText(/Mock Application Image/i)).toBeInTheDocument();
    expect(screen.getByText(/type = test type/i)).toBeInTheDocument();
    expect(screen.getByText(/assistant = test assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Close Icon/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /Mock Close Icon/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockOnRemove).toHaveBeenCalled();
  });
  test('should test the App Pill initial render and test the Application Image when there is app icon and test the close button', async () => {
    jest.spyOn(ApplicationsList, 'applicationsList').mockReturnValue([{id: '123', icon: 'test icon', type: 'test type'}]);
    renderWithProviders(
      <AppPill appId="123" onRemove={mockOnRemove} />
    );
    expect(screen.getByText(/Mock Application Image/i)).toBeInTheDocument();
    expect(screen.getByText(/type = test type/i)).toBeInTheDocument();
    expect(screen.queryByText(/assistant = test assistant/i)).not.toBeInTheDocument();
    expect(screen.getByText(/assistant = test icon/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Close Icon/i)).toBeInTheDocument();
    const closeButtonNode = screen.getByRole('button', {name: /Mock Close Icon/i});

    expect(closeButtonNode).toBeInTheDocument();
    await userEvent.click(closeButtonNode);
    expect(mockOnRemove).toHaveBeenCalled();
  });
});

import { screen } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import FormHeader from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

// Mocking Environment Toggle as part of unit testing
jest.mock('../../../../../App/CeligoAppBar/EnvironmentToggle', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../App/CeligoAppBar/EnvironmentToggle'),
  default: props => (
    <>
      <div>Mock Environment Toggle</div>
      <button type="button" onClick={props.handleToggle}>handleToggle</button>
    </>
  ),
}));

// Mocking Installation Guide as part of unit testing
jest.mock('../../../../../components/icons/InstallationGuideIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/icons/InstallationGuideIcon'),
  default: () => <div>Mocking Installation Guide</div>,
}));
describe('Testsuite for FormHeader', () => {
  test('should test Form header when the selectedAccountHasSandbox is set to true', async () => {
    const mockHandleToggle = jest.fn();

    renderWithProviders(
      <FormHeader
        selectedAccountHasSandbox
        helpURL="/test"
        handleToggle={mockHandleToggle}
    />
    );
    expect(screen.getByRole('heading', {
      name: /set up connection/i,
    })).toBeInTheDocument();
    expect(screen.getByText(/mock environment toggle/i)).toBeInTheDocument();
    const handleToggle = screen.getByRole('button', {
      name: /handletoggle/i,
    });

    expect(handleToggle).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {
      name: /handletoggle/i,
    }));
    expect(mockHandleToggle).toHaveBeenCalled();
  });
  test('should test Form header when the selectedAccountHasSandbox is set to false', () => {
    const mockHandleToggle = jest.fn();

    renderWithProviders(
      <FormHeader
        selectedAccountHasSandbox={false}
        helpURL="/test"
        handleToggle={mockHandleToggle}
    />
    );
    expect(screen.getByRole('heading', {
      name: /set up connection/i,
    })).toBeInTheDocument();
    const shopifyConnectionGuideNode = screen.getByRole('link', {
      name: /shopify connection guide mocking installation guide/i,
    });

    expect(shopifyConnectionGuideNode).toHaveAttribute('href', '/test');
    expect(screen.getByText(/mocking installation guide/i)).toBeInTheDocument();
  });
});

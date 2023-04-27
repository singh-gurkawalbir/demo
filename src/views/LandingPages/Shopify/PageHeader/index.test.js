import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ShopifyLandingPageHeader from '.';
import { renderWithProviders } from '../../../../test/test-utils';

// Mocking Action Group as part of unit testing
jest.mock('../../../../components/ActionGroup', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/ActionGroup'),
  default: props => (
    <>
      <div>Mocking ActionGroup</div>
      <div>{props.children}</div>
    </>
  ),
}));

// Mocking BackArrowIcon as part of unit testing
jest.mock('../../../../components/icons/BackArrowIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/BackArrowIcon'),
  default: () => <div>Mocking Back Arrow Icon</div>,
}));

// Mocking ApplicationImg as part of unit testing
jest.mock('../../../../components/icons/ApplicationImg', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/icons/ApplicationImg'),
  default: props => (
    <>
      <div>Mocking ApplicationImg</div>
      <div>type = {props.type}</div>
      <div>alt = {props.alt}</div>
      <div>size = {props.size}</div>
    </>
  ),
}));

describe('Testsuite for ShopifyLandingPageHeader', () => {
  test('should test the shopify landing page header', () => {
    renderWithProviders(
      <MemoryRouter><ShopifyLandingPageHeader /></MemoryRouter>

    );
    expect(screen.getByText(/mocking actiongroup/i)).toBeInTheDocument();

    const backArrowIcon = screen.getByText(/mocking back arrow icon/i);

    expect(backArrowIcon).toBeInTheDocument();
    expect(screen.getByText(/back to/i)).toBeInTheDocument();
    expect(screen.getByText(/mocking applicationimg/i)).toBeInTheDocument();
    expect(screen.getByText(/type = shopify/i)).toBeInTheDocument();
    expect(screen.getByText(/alt = shopify/i)).toBeInTheDocument();
    expect(screen.getByText(/size = small/i)).toBeInTheDocument();
  });
});

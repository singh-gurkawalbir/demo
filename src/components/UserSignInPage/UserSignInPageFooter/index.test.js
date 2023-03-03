
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import UserSignInPageFooter from '.';
import { renderWithProviders } from '../../../test/test-utils';

async function initUserSignInPageFooter(props = {}) {
  const ui = (
    <MemoryRouter>
      <UserSignInPageFooter {...props} />
    </MemoryRouter>
  );
  const { utils } = renderWithProviders(ui);

  return (
    utils
  );
}

describe('test suite for UserSignInPageFooter', () => {
  test('should pass the initial render without any props', async () => {
    await initUserSignInPageFooter();
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/undefined');
  });

  test('should pass the initial render with props', async () => {
    await initUserSignInPageFooter({
      linkLabel: 'allow',
      linkText: 'signup',
      link: 'signup',
    });
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(screen.queryByText('allow')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/signup');
  });
});


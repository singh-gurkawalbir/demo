import { screen } from '@testing-library/react';
import React from 'react';
import TitleTypography from '.';
import { renderWithProviders } from '../../../test/test-utils';

describe('Testsuite for TitleTypography', () => {
  test('should test the children passed to title typography', () => {
    const children = 'Test Children';

    const { container } = renderWithProviders(
      <TitleTypography className="test class">
        {children}
      </TitleTypography>
    );

    expect(container.firstChild.className).toEqual(expect.stringContaining('test class'));
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });
  test('should test empty string when children is not passed to title typography', () => {
    const children = '';

    const { container } = renderWithProviders(
      <TitleTypography className="test class">
        {children}
      </TitleTypography>
    );

    expect(container.firstChild.className).toEqual(expect.stringContaining('test class'));
    expect(container.textContent).toBe('');
  });
});

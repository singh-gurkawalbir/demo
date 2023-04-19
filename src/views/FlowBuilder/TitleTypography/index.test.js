import React from 'react';
import TitleTypography from '.';
import { renderWithProviders } from '../../../test/test-utils';

describe('Testsuite for TitleTypography', () => {
  test('should test the children passed to title typography', () => {
    const children = 'Test Children';

    renderWithProviders(
      <TitleTypography className="test class">
        {children}
      </TitleTypography>
    );

    expect(document.querySelector('.test.class')).toHaveTextContent(children);
  });
  test('should test empty string when children is not passed to title typography', () => {
    const children = '';

    renderWithProviders(
      <TitleTypography className="test class">
        {children}
      </TitleTypography>
    );

    expect(document.querySelector('.test.class')).toHaveTextContent(children);
  });
});

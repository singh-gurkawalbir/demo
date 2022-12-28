
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import LogoStrip from '.';

describe('logoStrip UI tests', () => {
  test('should do the test when application length exceeds maxlength', () => {
    renderWithProviders(<LogoStrip applications={['3dcart', 'docusign', 'salesforce', 'magento']} rows={2} columns={1} />);
    const images = screen.getAllByAltText(/.*/);

    expect(images).toHaveLength(1);

    const button = screen.getByRole('button');

    userEvent.click(button);
    const newimages = screen.getAllByAltText(/.*/);

    expect(newimages).toHaveLength(4);
    userEvent.click(newimages[0]);
    const lastimages = screen.getAllByAltText(/.*/);

    expect(lastimages).toHaveLength(1);
  });
  test('should do the test when application length is less than maxlength', () => {
    renderWithProviders(<LogoStrip applications={['3dcart', 'docusign', 'salesforce', 'magento']} rows={2} columns={3} />);
    const images = screen.getAllByAltText(/.*/);

    expect(images).toHaveLength(4);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

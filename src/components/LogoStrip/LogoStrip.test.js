/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import LogoStrip from '.';

describe('LogoStrip UI tests', () => {
  test('should do the test when application length exceeds maxlength', () => {
    renderWithProviders(<LogoStrip applications={['3dcart', 'docusign', 'salesforce', 'magento']} rows={2} columns={1} />);
    const images = screen.getAllByAltText(/.*/);

    expect(images.length).toBe(1);

    const button = screen.getByRole('button');

    userEvent.click(button);
    const newimages = screen.getAllByAltText(/.*/);

    expect(newimages.length).toBe(4);
    userEvent.click(newimages[0]);
    const lastimages = screen.getAllByAltText(/.*/);

    expect(lastimages.length).toBe(1);
  });
  test('should do the test when application length is less than maxlength', () => {
    renderWithProviders(<LogoStrip applications={['3dcart', 'docusign', 'salesforce', 'magento']} rows={2} columns={3} />);
    const images = screen.getAllByAltText(/.*/);

    expect(images.length).toBe(4);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

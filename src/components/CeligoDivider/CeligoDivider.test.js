import React from 'react';
import CeligoDivider from '.';
import { renderWithProviders } from '../../test/test-utils';

describe('celigoDivider UI test', () => {
  test('should render at left position', () => {
    const {container} = renderWithProviders(<CeligoDivider position="left" />);

    expect(container.firstChild.className).toEqual(expect.stringContaining('makeStyles-left-'));
    expect(container.firstChild.className).not.toEqual(expect.stringContaining('makeStyles-right-'));
  });

  test('should render at right position', () => {
    const {container} = renderWithProviders(<CeligoDivider position="right" />);

    expect(container.firstChild.className).toEqual(expect.stringContaining('makeStyles-right-'));
    expect(container.firstChild.className).not.toEqual(expect.stringContaining('makeStyles-left-'));
  });
});

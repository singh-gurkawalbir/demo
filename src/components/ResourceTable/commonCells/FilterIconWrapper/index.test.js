
import React from 'react';
import FilterIconWrapper from '.';
import { renderWithProviders } from '../../../../test/test-utils';

describe('testsuite for FilterIconWrapper', () => {
  test('should test the Filter Icon Wrapper when the selected prop is set to false', () => {
    renderWithProviders(
      <FilterIconWrapper selected={false} />
    );
    const svgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(svgNode.getAttribute('class')).not.toEqual(expect.stringContaining('makeStyles-filterSelected-'));
    expect(svgNode.getAttribute('class')).toEqual(expect.stringContaining('makeStyles-filter-'));
  });
  test('should test the Filter Icon Wrapper when the selected prop is set to true', () => {
    renderWithProviders(
      <FilterIconWrapper selected />
    );
    const svgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(svgNode.getAttribute('class')).toEqual(expect.stringContaining('makeStyles-filterSelected-'));
  });
});

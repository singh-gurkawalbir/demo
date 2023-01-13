
import { render } from '@testing-library/react';
import React from 'react';
import FilterIconWrapper from '.';

describe('testsuite for FilterIconWrapper', () => {
  test('should test the Filter Icon Wrapper when the selected prop is set to false', () => {
    render(
      <FilterIconWrapper selected={false} />
    );
    const svgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(svgNode.getAttribute('class')).not.toEqual(expect.stringContaining('makeStyles-filterSelected-'));
    expect(svgNode.getAttribute('class')).toEqual(expect.stringContaining('makeStyles-filter-'));
  });
  test('should test the Filter Icon Wrapper when the selected prop is set to true', () => {
    render(
      <FilterIconWrapper selected />
    );
    const svgNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(svgNode.getAttribute('class')).toEqual(expect.stringContaining('makeStyles-filterSelected-'));
  });
});

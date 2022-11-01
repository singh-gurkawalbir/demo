/* global describe, test, expect, jest */
import React from 'react';
import DragHandleGridItem from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

describe('DragHandleGridItem UI tests', () => {
  test('should pass the initial render', () => {
    const props = {
      orientation: 'vertical',
      onMouseDown: jest.fn(),
    };

    const {utils} = renderWithProviders(<DragHandleGridItem {...props} />);

    expect(utils.container).toContainHTML('<div><div class="makeStyles-dragBar-1 makeStyles-dragBar-5"><div class="makeStyles-line-2 makeStyles-verticalLine-3" /></div></div>');
  });
});

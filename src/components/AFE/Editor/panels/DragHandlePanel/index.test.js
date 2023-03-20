import React from 'react';
import DragHandleGridItem from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

describe('dragHandleGridItem UI tests', () => {
  test('should pass the initial render', () => {
    const props = {
      orientation: 'vertical',
      onMouseDown: jest.fn(),
    };

    const {utils} = renderWithProviders(<DragHandleGridItem {...props} />);

    // Checking if the component renders as needed in the absence of area prop
    expect(utils.container).toContainHTML('<div><div class="makeStyles-dragBar-1" style="cursor: ew-resize;"><div class="makeStyles-line-2 makeStyles-verticalLine-3" /></div></div>');
  });
});

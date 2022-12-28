import { render, screen } from '@testing-library/react';
import React from 'react';
import OverflowTreeItem from '.';

describe('test suite for OverflowTreeItem', () => {
  test('should able to render the OverflowTreeItem', async () => {
    const props = {
      label: 'Test Integration Name',
      nodeId: '12345',
    };

    render(<OverflowTreeItem {...props} />);
    expect(screen.getByRole('treeitem', {name: /Test Integration Name/i})).toBeInTheDocument();
  });
});


import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import Tag from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initTag({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <Tag {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('tag test cases', () => {
  runServer();
  test('should pass the initial render with default values', async () => {
    await initTag({
      props: {
        label: 'mock label',
        className: 'mock_class_name',
        color: 'warning',
      },
    });
    const mockEle = screen.queryByText('mock label');

    expect(mockEle).toBeInTheDocument();
    expect(mockEle).toHaveClass('mock_class_name');
  });
});

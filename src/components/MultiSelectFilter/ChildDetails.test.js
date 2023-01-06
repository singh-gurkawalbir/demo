import React from 'react';
import { screen } from '@testing-library/react';
import ChildJobDetail from './ChildDetails';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initTableBodyContent({
  parentId,
  checked = [],
  handleSelect = jest.fn(),
  current = {
    _id: 'id_0',
    name: 'Default Name',
  },

} = {}) {
  const ui = (
    <ChildJobDetail
      current={current}
      checked={checked}
      handleSelect={handleSelect}
      parentId={parentId}
    />
  );

  return renderWithProviders(ui);
}

describe('childJobDetail component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    await initTableBodyContent();

    expect(screen.queryByText(/Default Name/i)).toBeInTheDocument();
  });
});

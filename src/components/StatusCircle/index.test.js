
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import StatusCircle from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initStatusCircle({
  props = {
    className: 'mock-class-name',
  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <StatusCircle {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('statusCircle test cases', () => {
  runServer();

  test('should pass the initial render with default value/no props', async () => {
    const { utils } = await initStatusCircle();

    expect(utils.container.firstChild).toHaveClass('mock-class-name');
  });
});


import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CeligoTable from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initCeligoTable({ props } = {}) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('celigoTable component Test cases', () => {
  runServer();
  test('should pass the intial render with no column', async () => {
    const { utils } = await initCeligoTable();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the intial render with column', async () => {
    const { utils } = await initCeligoTable({
      props: {
        useColumns: jest.fn().mockReturnValue([]),
      },
    });

    expect(utils.container).not.toBeEmptyDOMElement();
  });
});

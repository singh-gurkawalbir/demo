/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import Mapper2Guide from './Mapper2Guide';

let initialStore;

async function initMapper2Guide(importId) {
  initialStore.getState().session.mapping = {
    mapping: {
      importId,
    },
  };
  initialStore.getState().data.resources = {
    imports: [
      {
        _id: '1',
        adaptorType: 'HTTPImport',
      },
    ],
  };
  const ui = (
    <MemoryRouter>
      <Mapper2Guide />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for Mapper2Guide', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  test('Should render Mapper2Guide when showGuide is true', async () => {
    await initMapper2Guide('1');
    expect(screen.getByText(/learn about mapper 2\.0/i)).toBeInTheDocument();
  });
  test('Should render null when showGuide is false', async () => {
    const { utils } = await initMapper2Guide('2');

    expect(utils.container).toBeEmptyDOMElement();
  });
});

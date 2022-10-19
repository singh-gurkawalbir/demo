/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import HandlebarGuide from './HandlebarGuide';

let initialStore;
let mockValue = false;

async function initHandlebarGuide() {
  initialStore.getState().session.editors = {
    1: {
      autoEvaluate: false,
    },
  };
  const ui = (
    <MemoryRouter>
      <HandlebarGuide />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('@material-ui/core', () => ({
  __esModule: true,
  ...jest.requireActual('@material-ui/core'),
  useMediaQuery: () => (jest.fn(() => mockValue))(),
}));

describe('test suite for HandlebarGuide', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  test('Should render HandlebarGuide', async () => {
    await initHandlebarGuide();
    const anchor = screen.getByRole('link', {
      name: /handlebars guide/i,
    });

    expect(anchor).toHaveAttribute('title', 'Handlebars guide');
    mockValue = true;
    await initHandlebarGuide();
    expect(screen.getByText(/handlebars guide/i)).toBeInTheDocument();
  });
});

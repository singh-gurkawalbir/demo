import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import References from '.';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders } from '../../../../../test/test-utils';

async function initReferences({
  props = {

  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <References {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

jest.mock('../../../../../components/ResourceReferences', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/ResourceReferences'),
  default: props => (
    <>
      <button type="button" onClick={props.onClose}>Mock Test Button</button>
    </>
  ),
}));

describe('references test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    await initReferences();

    const buttonRef = screen.getByRole('button');

    expect(buttonRef).toBeInTheDocument();
    await userEvent.click(buttonRef);

    const closeButton = screen.getByRole('button', {name: /Mock Test Button/i});

    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(closeButton).not.toBeInTheDocument();
  });
});

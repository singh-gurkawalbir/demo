
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import {DrawerProvider, useDrawerContext} from '.';

const MockComponent = () => {
  const { onClose } = useDrawerContext();

  return (
    <>
      <button type="button" onClick={onClose}>
        Click Here
      </button>
    </>
  );
};

async function initDrawerContext(props = {}) {
  const ui = (
    <MemoryRouter>
      <DrawerProvider {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
describe('DrawerContext tests', () => {
  const mock = jest.fn();

  test('Should able to test the drawer is rendered with Provider', async () => {
    await initDrawerContext({children: <MockComponent />, onClose: mock});
    const button = screen.getByRole('button', {name: 'Click Here'});

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(mock).toBeCalled();
  });
});

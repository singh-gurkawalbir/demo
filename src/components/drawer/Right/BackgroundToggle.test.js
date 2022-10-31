/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import BackgroundToggle from './BackgroundToggle';
import {DrawerProvider} from './DrawerContext';

const MockComponent = () => (<p>Text</p>);

async function initBackgroundToggle(props = {}, context = {}) {
  const ui = (
    <MemoryRouter>
      <DrawerProvider {...context}>
        <BackgroundToggle {...props} />
      </DrawerProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
describe('BackgroundToggle tests', () => {
  test('Should able to test the drawer background Toggle with height = short and !reverse -Dark', async () => {
    await initBackgroundToggle({children: <MockComponent />}, {height: 'short'});
    expect(screen.getByText(/Text/i)).toBeInTheDocument();
  });

  test('Should able to test the drawer background Toggle with height = tall and reverse -Dark', async () => {
    await initBackgroundToggle({children: <MockComponent />, reverse: true}, {height: 'tall'});
    expect(screen.getByText(/Text/i)).toBeInTheDocument();
  });
  test('Should able to test the drawer background Toggle with height = tall and reverse - Light', async () => {
    await initBackgroundToggle({children: <MockComponent />}, {height: 'tall'});
    expect(screen.getByText(/Text/i)).toBeInTheDocument();
  });
});

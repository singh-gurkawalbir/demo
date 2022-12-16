/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import RawView from '.';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
describe('RawView tests', () => {
  test('Should able to test RawView ', async () => {
    await renderWithProviders(<MemoryRouter> <RawView /></MemoryRouter>);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

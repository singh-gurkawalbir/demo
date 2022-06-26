/* global test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import FlowSchedule from '.';

const newprops = {flow: {_integrationId: '626bda66987bb423914b486f'}, resources: 'flows', required: true};

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  // eslint-disable-next-line no-unused-vars
  default: newprops => (
    <div>LoadResources called</div>
  ),
}));

test('checking render of Flow schedule', () => {
  renderWithProviders(<MemoryRouter><FlowSchedule {...newprops} /></MemoryRouter>);
  expect(screen.getByText(/LoadResources called/i)).toBeInTheDocument();
});

/* global describe, jest, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { SUPPORTED_RESOURCE_TYPES } from '../../utils/revisions';
import ResourceDiffVisualizer from '.';

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: ({children}) => children,
}));

jest.mock('./ResourceDiffContainer', () => ({
  __esModule: true,
  ...jest.requireActual('./ResourceDiffContainer'),
  default: ({resourceType}) => (<h1>{resourceType}</h1>),
}));

async function initResourceDiffVisualizer(props = {}) {
  const ui = (
    <MemoryRouter>
      <ResourceDiffVisualizer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('Test suite for ResourceDiffVisualizer component', () => {
  test('should be able to show all the resources', async () => {
    await initResourceDiffVisualizer();
    const resources = screen.getAllByRole('heading').map(ele => ele.textContent);

    expect(resources).toEqual(SUPPORTED_RESOURCE_TYPES);
  });
});

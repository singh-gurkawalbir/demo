
import React from 'react';
import { screen, render } from '@testing-library/react';
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

describe('Test suite for ResourceDiffVisualizer component', () => {
  test('should be able to show all the resources', async () => {
    render(<ResourceDiffVisualizer />);
    const resources = screen.getAllByRole('heading').map(ele => ele.textContent);

    expect(resources).toEqual(SUPPORTED_RESOURCE_TYPES);
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../CeligoTable';

const onClose = jest.fn();

function renderFunction(data = {}) {
  renderWithProviders(
    <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/childID/flowId']}>
      <Route path="/:integrationId/:childId/:flowId">
        <CeligoTable
          actionProps={{integrationId: 'inetgrationId', onClose}}
          {...metadata}
          data={[data]}
    />
      </Route>
    </MemoryRouter>,
  );
}
describe('running flows metadata column UI Tests', () => {
  test('should verify Name', async () => {
    renderFunction({resourceType: 'someType', name: 'someName'});
    expect(screen.getByText('Name')).toBeInTheDocument();
    const name = screen.getByText('someName');

    expect(name).toBeInTheDocument();
    await userEvent.click(name);
    expect(onClose).toHaveBeenCalled();
  });
  test('should verify Type', () => {
    renderFunction({resourceType: 'someType', name: 'someName'});
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('someType')).toBeInTheDocument();
  });
});

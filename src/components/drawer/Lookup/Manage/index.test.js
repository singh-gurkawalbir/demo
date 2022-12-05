/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import ManageLookup from '.';

async function initManageLookup(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.form = {
    formKey: {},
  };
  initialStore.getState().data.resources = {
    imports: [
      {_id: 'netsuite', adaptorType: 'NetSuiteImport'},
      {_id: 'salesforce', adaptorType: 'SalesforceImport'},
      {_id: 'rdbms', adaptorType: 'RDBMSImport'},
      {_id: 'http', adaptorType: 'HTTPImport'},
    ],
  };
  const ui = (
    <MemoryRouter>
      <ManageLookup {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('ManageLookup tests', () => {
  test('Should able to test the Manage Lookup drawer renders with errors', async () => {
    await initManageLookup({error: 'Invalid lookup'});
    expect(screen.getByRole('heading', {name: 'Invalid lookup'})).toBeInTheDocument();
  });
  test('Should able to test the Manage Lookup drawer renders with Netsuite Adapter', async () => {
    await initManageLookup({resourceType: 'imports', resourceId: 'netsuite', formKey: 'formKey'});
    expect(screen.getByRole('radiogroup', {name: 'Select'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Dynamic: NetSuite search'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Static: Value to value'})).toBeInTheDocument();
  });
  test('Should able to test the Manage Lookup drawer renders with Salesforce Adapter', async () => {
    await initManageLookup({resourceType: 'imports', resourceId: 'salesforce', formKey: 'formKey'});
    expect(screen.getByRole('radiogroup', {name: 'Select'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Dynamic: Salesforce search'})).toBeInTheDocument();
    expect(screen.getByRole('radio', {name: 'Static: Value to value'})).toBeInTheDocument();
  });
  test('Should able to test the Manage Lookup drawer renders with RDBMS Adapter', async () => {
    await initManageLookup({resourceType: 'imports', resourceId: 'rdbms', formKey: 'formKey'});
    expect(screen.getByRole('radiogroup', {name: 'Lookup type'})).toBeInTheDocument();
  });
});

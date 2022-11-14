/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../../test/test-utils';
import ErrorTable from '.';

const props = {integrationId: '_integrationId', revisionId: '_revisionId'};

async function initErrorTable(props = {}, data = []) {
  const initialStore = reduxStore;

  initialStore.getState().session.lifeCycleManagement.revision._integrationId = {
    _revisionId: {
      errors: {
        data,
      },
    },
  };

  const ui = (
    <MemoryRouter>
      <ErrorTable {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('ErrorTable tests', () => {
  test('Should able to test the initial render without errors', async () => {
    await initErrorTable(props);
    expect(screen.getByText('No errors')).toBeInTheDocument();
  });
  test('Should able to test the initial render with errors', async () => {
    const errData = [{code: 'err1', message: 'Error 1', _id: 'err_1', createdAt: '11/07/2022 8:10:53 am'}];

    await initErrorTable(props, errData);
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('err1')).toBeInTheDocument();
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';
import { REVISION_TYPES } from '../../../../../../constants';
import ResourceDiffError from '.';

const props = {integrationId: '_integrationId', type: REVISION_TYPES.SNAPSHOT, parentUrl: ''};

async function initResourceDiffError(props = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.lifeCycleManagement = {
    compare: {
      _integrationId: {error: 'sample error', status: 'received'},
    },
  };

  return renderWithProviders(<MemoryRouter><ResourceDiffError {...props} /> </MemoryRouter>, {initialStore});
}
describe('ResourceDiffError tests', () => {
  test('Should able to test the initial render with resourceDiffError type SnapShot', async () => {
    await initResourceDiffError(props);
    expect(screen.getByText('sample error')).toBeInTheDocument();
  });
  test('Should able to test the initial render with resourceDiffError type PULL', async () => {
    await initResourceDiffError({...props, type: REVISION_TYPES.PULL});
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create a new pull'})).toBeInTheDocument();
  });
  test('Should able to test the initial render with resourceDiffError type REVERT', async () => {
    await initResourceDiffError({...props, type: REVISION_TYPES.REVERT});
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Your revert is not allowed. Your operation is already on the same revision you\'re trying to revert to.')).toBeInTheDocument();
  });
});

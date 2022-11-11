/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import { REVISION_TYPES } from '../../../../../constants';
import ResourceDiffContent from '.';

const props = {integrationId: '_integrationId', type: REVISION_TYPES.SNAPSHOT, parentUrl: ''};

jest.mock('../../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../LoadResources'),
  default: ({children}) => children,
}));
async function initResourceDiffContent(props = {}, pushError = false, status = 'recieved', isValidDiff = false) {
  const initialStore = reduxStore;
  const differ = {
    reverted: {
      flow: {_flowId: {name: 'RevertedName'}},
    },
    current: {
      flow: {_flowId: {name: 'CurrentName'}},
    },
  };

  initialStore.getState().session.lifeCycleManagement = {
    compare: {
      _integrationId: {
        error: pushError ? 'sample error' : undefined,
        status,
        diff: isValidDiff ? differ : null,
      },
    },
  };

  return renderWithProviders(<ResourceDiffContent {...props} />, {initialStore});
}
describe('ResourceDiffContent tests', () => {
  test('Should able to test the initial render with ResourceDiffContent having DiffError', async () => {
    await initResourceDiffContent(props, true);
    expect(screen.getByText('sample error')).toBeInTheDocument();
  });
  test('Should able to test the initial render with component with resource comparision inProgress', async () => {
    await initResourceDiffContent(props, false, 'requested');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('Should able to test the ResourceDiffContent with Invalid REVERT ', async () => {
    await initResourceDiffContent({...props, type: REVISION_TYPES.REVERT});
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Your revert is not allowed. Your operation is already on the same revision you\'re trying to revert to.')).toBeInTheDocument();
  });

  test('Should able to test the ResourceDiffContent with Valid Revert', async () => {
    await initResourceDiffContent({...props, type: REVISION_TYPES.REVERT}, false, 'received', true);
    expect(screen.getByRole('button', {name: 'Flows'})).toBeInTheDocument();
    expect(screen.getByText('Action: Update')).toBeInTheDocument();
    expect(screen.getByText('CurrentName')).toBeInTheDocument();
    expect(screen.getByText('RevertedName')).toBeInTheDocument();
  });
});

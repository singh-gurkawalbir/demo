
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import UserName from './UserName';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

const initialStore = reduxStore;

initialStore.getState().user = {
  profile: {
    _id: '5cadc8b42b10347a2708bf29',
    name: 'Test',
    email: 'Test@celigo.com',
  },
};
initialStore.getState().data.resources = {
  flows: [
    {
      _id: 'flow_id_1',
      _integrationId: 'integration_id_1',
    },
  ],
  scripts: [],
};

describe('uI test cases for username', () => {
  const userId = 'auto';
  const flowId = '5ea16c600e2fab71928a6152';

  test('should test autoretried should be there when userid is set to auto and jobtype is retry', () => {
    renderWithProviders(<UserName
      userId={userId} flowId={flowId} jobType="retry" />);
    const res = screen.getByText('Auto-retried');

    expect(res).toBeInTheDocument();
  });
  test('should test autoretried should be there when userid is set to auto and jobtype is resolved', () => {
    renderWithProviders(<UserName
      userId={userId} flowId={flowId} jobType="resolved" />);
    const res = screen.getByText('Auto-resolved');

    expect(res).toBeInTheDocument();
  });
  test('should display userid or username when initial store is rendered', () => {
    renderWithProviders(<UserName
      userId="5cadc8b42b10347a2708bf29" flowId="flow_id_1" jobType="resolved" />, {initialStore});
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

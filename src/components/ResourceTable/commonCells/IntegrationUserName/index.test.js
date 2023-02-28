
import { screen } from '@testing-library/react';
import React from 'react';
import IntegrationUserName from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

let initialStore;

function initIntegrationUserName(userId, integrationId, profileData) {
  mutateStore(initialStore, draft => {
    draft.user = {
      profile: profileData,
      preferences: { defaultAShareId: 'own' },
      org: {
        accounts: [
          {
            _id: 'own',
            accessLevel: 'owner',
          },
        ],
      },
    };
  });
  const ui = (
    <IntegrationUserName userId={userId} integrationId={integrationId} />
  );

  return renderWithProviders(ui, {initialStore});
}
describe('testsuite for IntegrationUserName', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the integration user name when the userId is passed in props', () => {
    initIntegrationUserName('12345', '98765', { _id: '12345', email: 'something@test.com', name: 'First Last' });
    expect(screen.getByText(/first last/i)).toBeInTheDocument();
  });
  test('should test the user id passed in the prop', () => {
    initIntegrationUserName('12345', '98765', { _id: '23456', email: 'something@test.com', name: 'First Last' });
    expect(screen.getByText(/12345/i)).toBeInTheDocument();
  });
  test('should test the user email when name is not found', () => {
    initIntegrationUserName('12345', '98765', { _id: '12345', email: 'something@test.com' });
    expect(screen.getByText(/something@test.com/i)).toBeInTheDocument();
  });
});

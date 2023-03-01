
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import DynaIntegrationCloneSelect from '.';

const onFieldChange = jest.fn();
const props = {integrationId: '_integrationId', isValid: true, onFieldChange, id: '_id', label: '_label'};

async function initDynaIntegrationCloneSelect(props = {}, defaultAShareId = 'ashare1') {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement = {
      cloneFamily: {
        _integrationId: {
          cloneFamily: [
            {name: '_name1', _id: '_id1', sandbox: true},
            {name: '_name2', _id: '_id2'},
          ],
          status: 'completed',
        },
        _integrationId1: {
          status: 'requested',
        },
      },
    };
    draft.user = {
      profile: {
        developer: true,
      },
      preferences: { defaultAShareId, environment: 'sandbox' },
      org: {
        accounts: [
          {
            _id: 'ashare1',
            accepted: true,
            ownerUser: {
              company: 'Company One',
              licenses: [
                { _id: 'license1', type: 'integrator', sandbox: true, tier: 'standard', sso: true },
              ],
            },
          },
        ],
      },
    };
  });

  return renderWithProviders(<DynaIntegrationCloneSelect {...props} />, { initialStore });
}
describe('dynaIntegrationCloneSelect tests', () => {
  test('should be able to test component without account having Sandbox', async () => {
    await initDynaIntegrationCloneSelect(props, 'ashare2');
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('_label')).toBeInTheDocument();
    expect(screen.getByText('_name1')).toBeInTheDocument();
    expect(screen.getByText('_name2')).toBeInTheDocument();
    await userEvent.click(screen.getByText('_name2'));
    expect(onFieldChange).toHaveBeenCalledWith('_id', {environment: 'Production', label: '_name2', value: '_id2'});
  });
  test('should be able to test component with account having Sandbox', async () => {
    await initDynaIntegrationCloneSelect(props);
    expect(screen.getByText('_name1')).toBeInTheDocument();
    expect(screen.getByText('Sandbox')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
  });
  test('should be able to test component with cloneFamily still loading', async () => {
    await initDynaIntegrationCloneSelect({...props, integrationId: '_integrationId1'});
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('_label')).not.toBeInTheDocument();
  });
});


import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import ViewAliases from './ViewAliases';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function initViewAliases(props = {}) {
  const mustateState = draft => {
    draft.data.resources = {
      flows: [
        {
          _id: '63a9330112b8264c6c2393b0',
          name: '21497',
          _integrationId: '63433f87ba338228f2401609',
        },
      ],
      integrations: [{
        _id: '63433f87ba338228f2401609',
        lastModified: '2022-12-27T15:08:42.650Z',
        name: 'Integration1',
        install: [],
        _registeredConnectionIds: [
          '631a1bd9abf51e7a86c8123c',
        ],
      }]};
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: '/integrations/63433f87ba338228f2401609/flowBuilder/63a9330112b8264c6c2393b0/hooks/exports/63a55e14d9e20c15d94dacb6/editor/preSavePagescript'}]}>
      <Route path="/integrations/63433f87ba338228f2401609/flowBuilder/63a9330112b8264c6c2393b0/hooks/exports/63a55e14d9e20c15d94dacb6/editor/preSavePagescript">
        <ViewAliases {...props} />
      </Route>
    </MemoryRouter>, {initialStore});
}

describe('ViewAliases UI tests', () => {
  test('Should test the ViewAliases button when resource type is of exports', async () => {
    const mustateState = draft => {
      draft.session.editors = {
        preSavePagescript: {
          editorType: 'javascript',
          flowId: '63a9330112b8264c6c2393b0',
          resourceId: '63a55e14d9e20c15d94dacb6',
          integrationId: '63433f87ba338228f2401609',
          resourceType: 'exports',
        },
      };
    };

    mutateStore(initialStore, mustateState);
    initViewAliases({editorId: 'preSavePagescript'});
    await userEvent.click(screen.getByRole('button', {name: 'View aliases'}));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/63433f87ba338228f2401609/flowBuilder/63a9330112b8264c6c2393b0/hooks/exports/63a55e14d9e20c15d94dacb6/editor/preSavePagescript/aliases/view');
  });
  test('Should test the ViewAliases button when resource type is of integrations', async () => {
    const mustateState = draft => {
      draft.session.editors = {
        preSavePagescript: {
          editorType: 'javascript',
          flowId: '63a9330112b8264c6c2393b0',
          resourceId: '63a55e14d9e20c15d94dacb6',
          integrationId: '63433f87ba338228f2401609',
          resourceType: 'integrations',
        },
      };
    };

    mutateStore(initialStore, mustateState);
    initViewAliases({editorId: 'preSavePagescript'});
    await userEvent.click(screen.getByRole('button', {name: 'View aliases'}));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/63433f87ba338228f2401609/flowBuilder/63a9330112b8264c6c2393b0/hooks/exports/63a55e14d9e20c15d94dacb6/editor/preSavePagescript/aliases/view');
  });
});

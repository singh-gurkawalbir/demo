
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {mutateStore, reduxStore, renderWithProviders} from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';
import ReadmeSection from '.';

async function initReadme(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{_id: '678901234567890', readme: 'Demo HTML content'}];
    draft.user.preferences.defaultAShareId = 'own';
    draft.user.org.accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        ownerUser: {
          licenses: [],
        },
      },
    ];
  });

  return renderWithProviders(<MemoryRouter initialEntries={[{pathname: '/integrations/678901234567890/admin/readme'}]}><Route path="/integrations/678901234567890/admin/readme"><ReadmeSection {...props} /></Route></MemoryRouter>, {initialStore});
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('ReadmeSection UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should pass the initial render with the readme content of the integration', async () => {
    const props = {integrationId: '678901234567890'};

    await initReadme(props);
    expect(screen.getByText('Readme')).toBeInTheDocument();
    expect(screen.getByText('Edit readme')).toBeInTheDocument();
    expect(screen.getByText('Demo HTML content')).toBeInTheDocument();
  });
  test('should make the respective dispatch call and history redirection on clicking "Edit readme"', async () => {
    const props = {integrationId: '678901234567890'};

    await initReadme(props);
    await userEvent.click(screen.getByText('Edit readme'));
    expect(mockDispatchFn).toBeCalledWith(actions.editor.init('readme', 'readme', {
      resourceId: '678901234567890',
      resourceType: 'integrations',
      data: 'dummy data',
    }));
    await waitFor(() => expect(mockHistoryPush).toBeCalledWith('/integrations/678901234567890/admin/readme/editor/readme'));
  });
});

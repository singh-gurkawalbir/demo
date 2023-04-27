import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../actions';
import AgentToken from '.';
import { runServer } from '../../test/api/server';
import customCloneDeep from '../../utils/customCloneDeep';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';

async function initAgentToken({ agentId = '', initialStore = reduxStore} = {}) {
  const ui = (
    <MemoryRouter>
      <AgentToken
        agentId={agentId}
        />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('agentToken component Test cases', () => {
  runServer();
  let initialStore;
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = customCloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'AGENT_TOKEN_DISPLAY':
          mutateStore(initialStore, draft => {
            draft.session.agentAccessTokens = [{
              accessToken: 'token_id',
              _id: 'agent_id',
            }];
            draft.comms.networkComms['GET:/agents/agent_id/display-token'] = {
              status: 'success',
              hidden: false,
              refresh: false,
              method: 'GET',
            };
          });
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  describe('agentToken component custom agent render', () => {
    test('should pass the handleInstallerClick custom agent id', async () => {
      await initAgentToken({agentId: 'agent_id', initialStore});
      const showTokenButton = screen.getByRole('button', {name: 'Show token'});

      expect(showTokenButton).toBeInTheDocument();
      await userEvent.click(showTokenButton);
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.agent.displayToken('agent_id'));
    });

    test('should pass the handleInstallerClick token render', async () => {
      mutateStore(initialStore, draft => {
        draft.session.agentAccessTokens = [{
          accessToken: 'token_id',
          _id: 'agent_id',
        }];
      });
      await initAgentToken({agentId: 'agent_id', initialStore});
      const showTokenId = screen.queryByText('token_id');

      expect(showTokenId).toBeInTheDocument();
      await expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.agent.displayToken('agent_id'));
    });
  });
});

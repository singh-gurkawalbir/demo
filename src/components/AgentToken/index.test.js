import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../actions';
import AgentToken from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';

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
    initialStore = cloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'AGENT_TOKEN_DISPLAY':
          initialStore.getState().session.agentAccessTokens = [{
            accessToken: 'token_id',
            _id: 'agent_id',
          }];
          initialStore.getState().comms.networkComms['GET:/agents/agent_id/display-token'] = {
            status: 'success',
            hidden: false,
            refresh: false,
            method: 'GET',
          };
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
      initialStore.getState().session.agentAccessTokens = [{
        accessToken: 'token_id',
        _id: 'agent_id',
      }];
      await initAgentToken({agentId: 'agent_id', initialStore});
      const showTokenId = screen.queryByText('token_id');

      expect(showTokenId).toBeInTheDocument();
      await expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.agent.displayToken('agent_id'));
    });
  });
});

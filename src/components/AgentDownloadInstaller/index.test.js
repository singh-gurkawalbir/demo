import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../actions';
import AgentDownloadInstaller from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders} from '../../test/test-utils';

async function initAgentDownloadInstaller({ agentId = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <AgentDownloadInstaller
        agentId={agentId}
        />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('agentDownloadInstaller component Test cases', () => {
  runServer();
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

  describe('agentDownloadInstaller component initial render', () => {
    let downloadButton;

    beforeEach(async () => {
      await initAgentDownloadInstaller();
      downloadButton = screen.getByRole('button', {name: 'Download'});
    });

    test('should pass the intial render', () => {
      expect(downloadButton).toBeInTheDocument();
      expect(screen.queryByText('Windows')).not.toBeInTheDocument();
    });

    describe('agentDownloadInstaller component menuItem render', () => {
      let windowItem;

      beforeEach(async () => {
        await userEvent.click(downloadButton);
        windowItem = await screen.getByRole('menuitem', {name: 'Windows'});
      });

      test('should pass the handleMenuClick', () => {
        expect(windowItem).toBeInTheDocument();
      });

      test('should pass the handleInstallerClick with default agent id', async () => {
        await userEvent.click(windowItem);
        await expect(mockDispatchFn).toHaveBeenCalledWith(actions.agent.downloadInstaller('windows', ''));

        await waitFor(() => expect(screen.queryByText('Windows')).not.toBeInTheDocument());
      });
    });
  });

  describe('agentDownloadInstaller component custom agent render', () => {
    test('should pass the handleInstallerClick custom agent id', async () => {
      await initAgentDownloadInstaller({agentId: 'agent_id'});
      const downloadButton = screen.getByRole('button', {name: 'Download'});

      expect(downloadButton).toBeInTheDocument();
      await userEvent.click(downloadButton);
      const windowItem = await screen.getByRole('menuitem', {name: 'Windows'});

      expect(windowItem).toBeInTheDocument();
      await userEvent.click(windowItem);
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.agent.downloadInstaller('windows', 'agent_id'));

      await waitFor(() => expect(screen.queryByText('Windows')).not.toBeInTheDocument());
    });
  });
});

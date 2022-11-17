/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import ViewAliases from './ViewAliases';

let initialStore;
const mockPush = jest.fn();

async function initViewAliases(editorId) {
  initialStore.getState().session.editors = {
    '23c72': {
      integrationId: '27c21',
      flowId: '3761',
      resourceId: '298y1',
      resourceType: 'integrations',
    },
    '21a71': {
      flowId: '376ac',
      resourceId: '2b311',
      resourceType: 'flows',
    },
  };
  initialStore.getState().data.resources = {
    integrations: [
      {
        _id: '272a1',
        _connectorId: '28cu1',
      },
    ],
    flows: [
      {
        _id: '376ac',
        // _connectorId: '21d31',
      },
    ],
  };
  const ui = (
    <MemoryRouter>
      <ViewAliases editorId={editorId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));

describe('test suite for RouterGuide', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  afterEach(() => {
    mockPush.mockClear();
  });

  test('Should render ViewAliases and clicking should work', async () => {
    await initViewAliases('23c72');
    const button = screen.getByRole('button', {
      name: /view aliases/i,
    });

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(mockPush).toHaveBeenCalledTimes(1);
  });
  test('Should render null when integrationId is false or isIntegrationApp is true', async () => {
    const { utils } = await initViewAliases('21a71');

    expect(utils.container).toBeEmptyDOMElement();
  });
});
